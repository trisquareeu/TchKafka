import { PartitionV9, PartitionV9Factory } from './partition-v9';

export class PartitionV10 extends PartitionV9 {}

export class PartitionV10Factory extends PartitionV9Factory {
  public override create(): PartitionV10 {
    return super.create();
  }
}
