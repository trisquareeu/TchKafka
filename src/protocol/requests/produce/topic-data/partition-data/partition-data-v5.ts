import { PartitionDataV4, PartitionDataV4Factory } from './partition-data-v4';

export class PartitionDataV5 extends PartitionDataV4 {}

export class PartitionDataV5Factory extends PartitionDataV4Factory {
  public create(): PartitionDataV5 {
    return super.create();
  }
}
