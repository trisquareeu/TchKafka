import { PartitionDataV5, PartitionDataV5Factory } from './partition-data-v5';

export class PartitionDataV6 extends PartitionDataV5 {}

export class PartitionDataV6Factory extends PartitionDataV5Factory {
  public create(): PartitionDataV6 {
    return super.create();
  }
}
