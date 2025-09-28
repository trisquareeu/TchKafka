import { PartitionDataV3, PartitionDataV3Factory } from './partition-data-v3';

export class PartitionDataV4 extends PartitionDataV3 {}

export class PartitionDataV4Factory extends PartitionDataV3Factory {
  public override create(): PartitionDataV4 {
    return super.create();
  }
}
