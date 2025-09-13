import { CompactArray, Int32, type ReadBuffer, TagSection } from '../..';
import { CoordinatorV6 } from './coordinators';

export class FindCoordinatorResponseV6Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly coordinators: CompactArray<CoordinatorV6>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): FindCoordinatorResponseV6Data {
    const throttleTimeMs = Int32.deserialize(buffer);
    const coordinators = CompactArray.deserialize(buffer, CoordinatorV6.deserialize);
    const tags = TagSection.deserialize(buffer);

    return new FindCoordinatorResponseV6Data(throttleTimeMs, coordinators, tags);
  }
}
