import { randomUUID } from 'crypto';
import { NoOpAuthenticator, SessionBuilder, TcpSocketFactory, type SessionOptions } from '../client/session';
import { BootstrapCluster, Cluster, type ConnectionInfo } from '../cluster';
import { ProduceRequestBuilder } from '../protocol/requests/produce/produce-request-builder';
import { RoundRobinPartitioner, type Partitioner } from './partitioner';
import { type Serializer } from './serializer';

export type ProducerRecord<K, V> = {
  topic: string;
  // partition?: number; TODO: enable sending record to a specific partition;
  headers: Record<any, any>; // FIXME: Narrow the type;
  key: K;
  value: V;
  timestamp: number | undefined;
};

type ProducerConfig = Partial<Pick<SessionOptions, 'clientId' | 'connectionTimeout'>> & {
  acks: number;
  timeout: number;
};

const defaultProducerConfig: Required<ProducerConfig> = {
  acks: 0,
  timeout: 5000,
  clientId: randomUUID(),
  connectionTimeout: 5000
};

export class Producer<K, V> {
  private readonly bootstrapCluster: BootstrapCluster;
  private readonly cluster: Cluster;
  private readonly config: Required<ProducerConfig>;

  constructor(
    brokers: ConnectionInfo[],
    private readonly keySerializer: Serializer<K>,
    private readonly valueSerializer: Serializer<V>,
    config?: ProducerConfig,
    private readonly partitioner: Partitioner<K, V> = new RoundRobinPartitioner()
  ) {
    // FIXME: We need to add some properties to the config to properly setup session builder with proper SocketFactory and Authenticator
    this.config = { ...defaultProducerConfig, ...config };
    const sessionBuilder = new SessionBuilder(new TcpSocketFactory(), new NoOpAuthenticator(), {
      clientId: this.config.clientId,
      connectionTimeout: this.config.connectionTimeout,
      clientSoftwareName: 'tchkafka',
      clientSoftwareVersion: '0.0.1'
    });

    this.bootstrapCluster = new BootstrapCluster(brokers, sessionBuilder, {
      clientId: this.config.clientId,
      allowAutoTopicCreation: false,
      includeClusterAuthorizedOperations: false,
      includeTopicAuthorizedOperations: false
    });
    this.cluster = Cluster.empty(sessionBuilder);
  }

  public async send(record: ProducerRecord<K, V>): Promise<void> {
    const topicMetadata = await this.bootstrapCluster.getTopicMetadata(record.topic);
    const partitionsCount = topicMetadata.partitions.value!.length; // FIXME: Value possibly null, but is it really?;

    const serializedKey = await this.keySerializer.serialize(record.topic, record.key);
    const serializedValue = await this.valueSerializer.serialize(record.topic, record.value);
    const partition = this.partitioner.partition(
      record.topic,
      record.key,
      serializedKey,
      record.value,
      serializedValue,
      partitionsCount
    );

    const partitionMetadata = topicMetadata.partitions.value?.find(
      (metadata) => metadata.partitionIndex.value === partition
    );
    if (!partitionMetadata) {
      throw new Error(`Partition ${partition} not found`);
    }

    const leaderClient = this.cluster.getClient(partitionMetadata.leaderId.value);
    await leaderClient.send(
      new ProduceRequestBuilder(this.config.clientId, null, this.config.acks, this.config.timeout, [
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
  }
}
