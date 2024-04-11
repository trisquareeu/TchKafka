import { randomUUID } from 'crypto';
import { Client } from '../client';
import { NoOpAuthenticator, SessionBuilder, TcpSocketFactory, type SessionOptions } from '../client/session';
import { type ConnectionInfo } from '../cluster';
import { MetadataRequestBuilder, ProduceRequestBuilder } from '../protocol/requests';
import { RoundRobinPartitioner, type Partitioner } from './partitioner';
import { type Producer, type ProducerConfig, type ProducerRecord, type RecordMetadata } from './producer';
import { type Serializer } from './serializer';

export class DumbProducer<K, V> implements Producer<K, V> {
  private readonly sessionBuilder: SessionBuilder;
  private readonly sessionOptions: SessionOptions;

  constructor(
    private readonly bootstrapServers: [ConnectionInfo],
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
  }

  public async send<H extends Record<string, string | string[]>>(
    record: ProducerRecord<K, V, H>,
    timeout = 30_000
  ): Promise<RecordMetadata | undefined> {
    // get topic metadata
    const bootstrapClient = new Client(
      this.bootstrapServers[0].host,
      this.bootstrapServers[0].port,
      this.sessionBuilder
    );
    const topicMetadataResponse = await bootstrapClient.send(
      new MetadataRequestBuilder(this.sessionOptions.clientId, [{ name: record.topic }], true, false, false)
    );
    const topicMetadata = topicMetadataResponse.topics.value?.find(
      (metadataTopic) => metadataTopic.name.value === record.topic
    );
    if (!topicMetadata) {
      throw new Error(`Topic ${record.topic} not found`);
    }
    if (topicMetadata.errorCode.value !== 0) {
      throw new Error(`Topic ${record.topic} error: ${topicMetadata.errorCode.value}`);
    }

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
      topicMetadata.partitions.value?.length || 0
    );

    // find partition leader
    const partitionMetadata = topicMetadata.partitions.value?.find(
      (metadata) => metadata.partitionIndex.value === partition
    );
    if (!partitionMetadata) {
      throw new Error(`Partition ${partition} not found`);
    }
    if (partitionMetadata.errorCode.value !== 0) {
      throw new Error(`Partition ${partition} error: ${partitionMetadata.errorCode.value}`);
    }

    // get leader client
    const leader = topicMetadataResponse.brokers.value?.find(
      (broker) => broker.nodeId.value === partitionMetadata.leaderId.value
    );
    if (!leader) {
      throw new Error(`Leader ${partitionMetadata.leaderId.value} not found`);
    }
    const leaderClient = new Client(leader.host.value, leader.port.value, this.sessionBuilder);

    // send record
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
}
