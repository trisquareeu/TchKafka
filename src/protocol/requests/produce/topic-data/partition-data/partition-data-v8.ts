import { PartitionDataV6, PartitionDataV6Factory } from './partition-data-v6';

export class PartitionDataV8 extends PartitionDataV6 {}

export class PartitionDataV8Factory extends PartitionDataV6Factory {
  public create(): PartitionDataV8 {
    return super.create();
  }
}
