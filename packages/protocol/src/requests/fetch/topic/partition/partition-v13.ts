import { PartitionV12, PartitionV12Factory } from './partition-v12';

export class PartitionV13 extends PartitionV12 {}

export class PartitionV13Factory extends PartitionV12Factory {
  public override create(): PartitionV13 {
    return super.create();
  }
}
