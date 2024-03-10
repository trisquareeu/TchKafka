import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV7 } from './partition-response';

export class ResponseV7 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV7>
  ) {}

  public static deserialize(buffer: ReadBuffer): ResponseV7 {
    return new ResponseV7(String.deserialize(buffer), Array.deserialize(buffer, PartitionResponseV7.deserialize));
  }
}
