import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV7 } from './partition';

export class ResponseV7 {
  constructor(
    public readonly topic: String,
    public readonly partitions: Array<PartitionV7>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV7> {
    return new ResponseV7(await String.deserialize(buffer), await Array.deserialize(buffer, PartitionV7.deserialize));
  }
}
