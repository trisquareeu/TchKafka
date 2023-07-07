import type { ConsumerGroupMetadata, OffsetAndMetadata, PartitionInfo, TopicPartition } from './consumer.types';

export type ProducerRecord<K extends keyof any, V> = {
  topic: string;
  partition: number;
  headers: Record<any, any>; // FIXME: Narrow the type;
  key: K;
  value: V;
  timestamp: number;
};

export type RecordMetadata = {
  offset: bigint;
  timestamp: number;
  serializedKeySize: number;
  serializedValueSize: number;
  topicPartition: TopicPartition;
};

export type SendCallback = (metadata?: RecordMetadata, error?: Error) => Promise<void> | void;

export interface Producer<K extends keyof any, V> {
  initTransactions(): Promise<void>;

  beginTransaction(): Promise<void>;

  sendOffsetsToTransaction(
    offsets: Map<TopicPartition, OffsetAndMetadata>,
    groupMetadata: ConsumerGroupMetadata
  ): Promise<void>;

  commitTransaction(): Promise<void>;

  abortTransaction(): Promise<void>;

  send(record: ProducerRecord<K, V>, callback?: SendCallback): Promise<RecordMetadata>;

  flush(): Promise<void>;

  partitionsFor(topic: string): Promise<PartitionInfo[]>;

  metrics(): any; // FIXME: Specify return type;

  close(): Promise<void>;
}
