import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV5 } from './partition-response';

export class ResponseV5 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV5>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV5> {
    return new ResponseV5(
      await String.deserialize(buffer),
      await Array.deserialize(buffer, PartitionResponseV5.deserialize)
    );
  }
}
