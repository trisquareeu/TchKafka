import { PartitionV10, PartitionV10Factory } from './partition-v10';

export class PartitionV11 extends PartitionV10 {}

export class PartitionV11Factory extends PartitionV10Factory {
  public override create(): PartitionV11 {
    return super.create();
  }
}
