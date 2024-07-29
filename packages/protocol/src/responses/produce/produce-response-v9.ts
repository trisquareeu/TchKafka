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

  public static async deserialize(buffer: ReadBuffer): Promise<ProduceResponseV9Data> {
    return new ProduceResponseV9Data(
      await CompactArray.deserialize(buffer, ResponseV9.deserialize),
      await Int32.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
