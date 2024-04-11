import { randomUUID } from 'crypto';
import { NoOpAuthenticator, SessionBuilder, TcpSocketFactory, type SessionOptions } from '../client/session';
import { BootstrapCluster, Cluster, type ConnectionInfo, type TopicMetadata } from '../cluster';
import { ClusterFactory } from '../cluster/cluster-factory';
import { ProduceRequestBuilder } from '../protocol/requests';
import { RoundRobinPartitioner, type Partitioner } from './partitioner';
import { type Producer, type ProducerConfig, type ProducerRecord, type RecordMetadata } from './producer';
import { type Serializer } from './serializer';

export class SmartProducer<K, V> implements Producer<K, V> {
  private readonly sessionBuilder: SessionBuilder;
  private readonly sessionOptions: SessionOptions;
  private cluster: Cluster;
  private readonly clusterFactory: ClusterFactory;
  private readonly bootstrapCluster: BootstrapCluster;

  constructor(
    bootstrapServers: [ConnectionInfo, ...ConnectionInfo[]],
    private readonly config: ProducerConfig,
    private readonly keySerializer: Serializer<K>,
    private readonly valueSerializer: Serializer<V>,
    private readonly partitioner: Partitioner<K, V> = new RoundRobinPartitioner()
  ) {
    this.sessionOptions = {
      connectionTimeout: config.clientOptions?.connectionTimeout ?? 30_000,
      clientId: config.clientOptions?.clientId ?? `TchKafka(${randomUUID()})`,
      clientSoftwareName: 'TchKafka',
      clientSoftwareVersion: '0.0.1'
    };
    this.sessionBuilder = new SessionBuilder(
      config.auth?.socketFactory ?? new TcpSocketFactory(),
      config.auth?.authenticator ?? new NoOpAuthenticator(),
      this.sessionOptions
    );
    this.bootstrapCluster = new BootstrapCluster(bootstrapServers, this.sessionBuilder);
    this.cluster = Cluster.empty(this.sessionBuilder);
    this.clusterFactory = new ClusterFactory();
  }

  public async send<H extends Record<string, string | string[]>>(
    record: ProducerRecord<K, V, H>,
    timeout = 30_000
  ): Promise<RecordMetadata | undefined> {
    const timeoutTimestamp = new Date().getTime() + timeout;
    const topicMetadata = await this.getTopicMetadata(record.topic, timeoutTimestamp, record.partition);

    // serialize key and value
    const serializedKey = await this.keySerializer.serialize(record.topic, record.key);
    const serializedValue = await this.valueSerializer.serialize(record.topic, record.value);

    // select partition
    const partition = this.partitioner.partition(
      record.topic,
      record.key,
      serializedKey,
      record.value,
      serializedValue,
      Object.keys(topicMetadata).length
    );

    // find partition leader
    const partitionMetadata = topicMetadata[partition];
    if (!partitionMetadata) {
      throw new Error(`Partition ${partition} not found`);
    }

    // get leader client
    const leaderClient = this.cluster.getClient(partitionMetadata.leaderId);
    const response = await leaderClient.send(
      new ProduceRequestBuilder(this.sessionOptions.clientId, null, this.config.acks, timeout, [
        {
          name: record.topic,
          partitionData: [
            {
              index: partition,
              records: [
                { key: serializedKey, value: serializedValue, headers: record.headers, timestamp: record.timestamp }
              ]
            }
          ]
        }
      ])
    );

    // only one topic and partition is sent
    if (response.responses.value![0]!.partitionResponses.value![0]!.errorCode.value !== 0) {
      throw new Error(
        `Partition ${partition} error: ${response.responses.value![0]!.partitionResponses.value![0]!.errorCode.value}`
      );
    }

    return {
      topic: record.topic,
      partition,
      offset: response.responses.value![0]!.partitionResponses.value![0]!.baseOffset.value,
      serializedKeySize: serializedKey.length,
      serializedValueSize: serializedValue.length,
      timestamp:
        record.timestamp !== undefined
          ? BigInt(record.timestamp)
          : response.responses.value![0]!.partitionResponses.value![0]!.logAppendTime.value
    };
  }

  private async getTopicMetadata(topic: string, timeoutTimestamp: number, partition?: number): Promise<TopicMetadata> {
    if (this.cluster.isTopicInvalid(topic)) {
      throw new Error(`Topic ${topic} is invalid`);
    }

    const topicMetadata = this.cluster.getTopicMetadata(topic);
    if (topicMetadata && (partition === undefined || Object.keys(topicMetadata).includes(partition.toString()))) {
      return topicMetadata;
    }

    this.clusterFactory.addTopic({ name: topic });

    do {
      this.cluster = await this.clusterFactory.fetch(this.bootstrapCluster.getClient());
      const newTopicMetadata = this.cluster.getTopicMetadata(topic);

      if (
        newTopicMetadata &&
        (partition === undefined || Object.keys(newTopicMetadata).includes(partition.toString()))
      ) {
        return newTopicMetadata;
      }
    } while (new Date().getTime() < timeoutTimestamp);

    throw new Error('Timeout exceeded while fetching topic metadata');
  }
}
