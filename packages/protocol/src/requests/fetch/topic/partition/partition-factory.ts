export type Partition = {
  partition: number;
  fetchOffset: bigint;
  logStartOffset: bigint;
  partitionMaxBytes: number;
};

export abstract class PartitionFactoryTemplate<T> {
  constructor(protected readonly partition: Partition) {}

  public abstract create(): T;
}
