import { PartitionV7, PartitionV7Factory } from './partition-v7';

export class PartitionV8 extends PartitionV7 {}

export class PartitionV8Factory extends PartitionV7Factory {
  public override create(): PartitionV8 {
    return super.create();
  }
}
