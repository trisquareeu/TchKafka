import { PartitionV14, PartitionV14Factory } from './partition-v14';

export class PartitionV15 extends PartitionV14 {}

export class PartitionV15Factory extends PartitionV14Factory {
  public override create(): PartitionV15 {
    return super.create();
  }
}
