import { TagSection } from '../../../commons';
import { CompactArray, CompactString } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV10 } from './partition-response';

export class ResponseV10 {
  constructor(
    public readonly name: CompactString,
    public readonly partitionResponses: CompactArray<PartitionResponseV10>,
    public readonly tags: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV10> {
    return new ResponseV10(
      await CompactString.deserialize(buffer),
      await CompactArray.deserialize(buffer, PartitionResponseV10.deserialize),
      await TagSection.deserialize(buffer)
    );
  }
}
