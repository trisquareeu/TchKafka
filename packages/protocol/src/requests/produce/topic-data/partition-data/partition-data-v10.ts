import { PartitionDataV9, PartitionDataV9Factory } from './partition-data-v9';

export class PartitionDataV10 extends PartitionDataV9 {}

export class PartitionDataV10Factory extends PartitionDataV9Factory {
  public create(): PartitionDataV10 {
    return super.create();
  }
}
