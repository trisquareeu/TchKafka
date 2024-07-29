import { TagSection } from '../../../commons';
import { CompactArray, CompactString } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionResponseV9 } from './partition-response';

export class ResponseV9 {
  constructor(
    public readonly name: CompactString,
    public readonly partitionResponses: CompactArray<PartitionResponseV9>,
    public readonly tags: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseV9> {
    return new ResponseV9(
      await CompactString.deserialize(buffer),
      await CompactArray.deserialize(buffer, PartitionResponseV9.deserialize),
      await TagSection.deserialize(buffer)
    );
  }
}
