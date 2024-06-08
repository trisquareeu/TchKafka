import { Array, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV6 } from './partition-response';

export class ResponseV6 {
  constructor(
    public readonly name: String,
    public readonly partitionResponses: Array<PartitionResponseV6>
  ) {}

  public static deserialize(buffer: ReadBuffer): ResponseV6 {
    return new ResponseV6(String.deserialize(buffer), Array.deserialize(buffer, PartitionResponseV6.deserialize));
  }
}
