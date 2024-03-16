import { TagSection } from '../../commons';
import { CompactArray, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV9 } from './response';

export class ProduceResponseV9Data {
  constructor(
    public readonly responses: CompactArray<ResponseV9>,
    public readonly throttleTimeMs: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV9Data {
    return new ProduceResponseV9Data(
      CompactArray.deserialize(buffer, ResponseV9.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
