import { PartitionDataV6, PartitionDataV6Factory } from './partition-data-v6';

export class PartitionDataV7 extends PartitionDataV6 {}

export class PartitionDataV7Factory extends PartitionDataV6Factory {
  public create(): PartitionDataV7 {
    return super.create();
  }
}
