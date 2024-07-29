import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV3 } from './partition-response';

export class ResponseV3 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV3>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV3> {
    return new ResponseV3(
      await String.deserialize(buffer),
      await Array.deserialize(buffer, PartitionResponseV3.deserialize)
    );
  }
}
