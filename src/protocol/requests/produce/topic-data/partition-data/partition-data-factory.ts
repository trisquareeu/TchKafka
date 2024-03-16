export type SerializedRecord = {
  headers: Record<string, string | string[]>; // FIXME: Narrow the type;
  key: Buffer;
  value: Buffer;
  timestamp?: number;
};

export type PartitionData = {
  index: number;
  records: SerializedRecord[];
};

export abstract class PartitionDataFactoryTemplate<T> {
  constructor(protected readonly partitionData: PartitionData) {}

  public abstract create(): T;
}
