import { TagSection } from '../../commons';
import { CompactArray, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV10 } from './response';

export class ProduceResponseV10Data {
  constructor(
    public readonly responses: CompactArray<ResponseV10>,
    public readonly throttleTimeMs: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV10Data {
    return new ProduceResponseV10Data(
      CompactArray.deserialize(buffer, ResponseV10.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
