import { PartitionV6, PartitionV6Factory } from './partition-v6';

export class PartitionV7 extends PartitionV6 {}

export class PartitionV7Factory extends PartitionV6Factory {
  public override create(): PartitionV7 {
    return super.create();
  }
}
