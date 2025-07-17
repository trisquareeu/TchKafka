import { PartitionV13, PartitionV13Factory } from './partition-v13';

export class PartitionV14 extends PartitionV13 {}

export class PartitionV14Factory extends PartitionV13Factory {
  public override create(): PartitionV14 {
    return super.create();
  }
}
