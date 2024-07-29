import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV4 } from './partition-response';

export class ResponseV4 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV4>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV4> {
    return new ResponseV4(
      await String.deserialize(buffer),
      await Array.deserialize(buffer, PartitionResponseV4.deserialize)
    );
  }
}
