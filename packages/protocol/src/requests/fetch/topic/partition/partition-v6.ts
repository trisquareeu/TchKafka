import { PartitionV5, PartitionV5Factory } from './partition-v5';

export class PartitionV6 extends PartitionV5 {}

export class PartitionV6Factory extends PartitionV5Factory {
  public override create(): PartitionV6 {
    return super.create();
  }
}
