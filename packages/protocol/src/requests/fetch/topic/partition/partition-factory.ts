export type Partition = {
  partition: number;
  currentLeaderEpoch?: number;
  fetchOffset: bigint;
  lastFetchedEpoch?: number;
  logStartOffset: bigint;
  partitionMaxBytes: number;
};

export abstract class PartitionFactoryTemplate<T> {
  constructor(protected readonly partition: Partition) {}

  public abstract create(): T;
}
