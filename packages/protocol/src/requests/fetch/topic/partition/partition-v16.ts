import { PartitionV15, PartitionV15Factory } from './partition-v15';

export class PartitionV16 extends PartitionV15 {}

export class PartitionV16Factory extends PartitionV15Factory {
  public override create(): PartitionV16 {
    return super.create();
  }
}
