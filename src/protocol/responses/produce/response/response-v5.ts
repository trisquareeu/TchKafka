import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV5 } from './partition-response';

export class ResponseV5 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV5>
  ) {}

  public static deserialize(buffer: ReadBuffer): ResponseV5 {
    return new ResponseV5(String.deserialize(buffer), Array.deserialize(buffer, PartitionResponseV5.deserialize));
  }
}
