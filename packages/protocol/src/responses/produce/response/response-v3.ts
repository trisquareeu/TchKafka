import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV3 } from './partition-response';

export class ResponseV3 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV3>
  ) {}

  public static deserialize(buffer: ReadBuffer): ResponseV3 {
    return new ResponseV3(String.deserialize(buffer), Array.deserialize(buffer, PartitionResponseV3.deserialize));
  }
}
