import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV8 } from './partition-response';

export class ResponseV8 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV8>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV8> {
    return new ResponseV8(
      await String.deserialize(buffer),
      await Array.deserialize(buffer, PartitionResponseV8.deserialize)
    );
  }
}
