import { PartitionV16, PartitionV16Factory } from './partition-v16';

export class PartitionV17 extends PartitionV16 {}

export class PartitionV17Factory extends PartitionV16Factory {
  public override create(): PartitionV17 {
    return super.create();
  }
}
