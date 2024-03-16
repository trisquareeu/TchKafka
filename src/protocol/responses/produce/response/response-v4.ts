import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV4 } from './partition-response';

export class ResponseV4 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV4>
  ) {}

  public static deserialize(buffer: ReadBuffer): ResponseV4 {
    return new ResponseV4(String.deserialize(buffer), Array.deserialize(buffer, PartitionResponseV4.deserialize));
  }
}
