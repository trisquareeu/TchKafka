import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV7 } from './partition-response';

export class ResponseV7 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV7>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV7> {
    return new ResponseV7(
      await String.deserialize(buffer),
      await Array.deserialize(buffer, PartitionResponseV7.deserialize)
    );
  }
}
