export type TopicPartition = {
  readonly partition: number;
  readonly topic: string;
};

export type Duration = number;

export type ConsumerRebalanceListener = {
  onPartitionsAssigned: (partitions: TopicPartition[]) => Promise<void> | void;
  onPartitionsRevoked: (partitions: TopicPartition[]) => Promise<void> | void;
  onPartitionLost: (partitions: TopicPartition[]) => Promise<void> | void;
};

export type ConsumerRecords<K extends keyof any, V> = Record<K, V>;

export type OffsetAndMetadata = {
  offset: BigInt;
  metadata: string;
  leaderEpoch: number;
};

export type KafkaNode = {
  id: number;
  idString: string;
  host: string;
  port: number;
  rack: string;
};

export type PartitionInfo = {
  topic: string;
  partition: number;
  leader: KafkaNode;
  replicas: KafkaNode[];
  inSyncReplicas: KafkaNode[];
  offlineReplicas: KafkaNode[];
};

export type OffsetAndTimestamp = {
  timestamp: BigInt;
  offset: BigInt;
  leaderEpoch?: number;
};

export type ConsumerGroupMetadata = {
  groupId: string;
  generationId: number;
  memberId: string;
  groupInstanceId?: string;
};

export interface Consumer<K extends keyof any, V> {
  assignment(): Set<TopicPartition>;

  subscription(): Set<string>;

  subscribe(topics: string[]): Promise<void>;

  subscribe(topics: string[], callback: ConsumerRebalanceListener): Promise<void>;

  assign(partitions: TopicPartition[]): Promise<void>;

  unsubscribe(): Promise<void>;

  poll(timeout: Duration): Promise<ConsumerRecords<K, V>>;

  commit(timeout?: Duration): Promise<void>;

  seek(partition: TopicPartition, offset: number): Promise<void>;

  seekToBeginning(partitions: TopicPartition[]): Promise<void>;

  seekToEnd(partitions: TopicPartition[]): Promise<void>;

  position(partition: TopicPartition, timeout?: Duration): Promise<number>;

  committed(partitions: Set<TopicPartition>, timeout?: Duration): Promise<Map<TopicPartition, OffsetAndMetadata>>;

  metrics(): any; // FIXME(Michał): Specify return type;

  partitionsFor(topic: string, timeout?: Duration): Promise<PartitionInfo[]>;

  listTopics(timeout?: Duration): Map<string, PartitionInfo[]>;

  paused(): Set<TopicPartition>;

  pause(partitions: TopicPartition[]): Promise<void>;

  resume(partitions: TopicPartition[]): Promise<void>;

  offsetsForTimes(
    timestampsToSearch: Map<TopicPartition, number>,
    timeout?: Duration
  ): Promise<Map<TopicPartition, OffsetAndTimestamp>>;

  beginningOffsets(partitions: TopicPartition[], timeout?: Duration): Promise<Map<TopicPartition, BigInt>>;

  endOffsets(partitions: TopicPartition[], timeout: Duration): Promise<Map<TopicPartition, BigInt>>;

  currentLag(topicPartition: TopicPartition): Promise<number>;

  groupMetadata(): Promise<ConsumerGroupMetadata>;

  enforceRebalance(reason: string): Promise<void>;

  wakeup(): Promise<void>;

  close(): Promise<void>;
}
