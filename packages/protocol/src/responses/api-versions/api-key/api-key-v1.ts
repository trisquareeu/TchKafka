import { TagSection } from '../../../commons';
import { Int16 } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';

export class ApiKeyV1 {
  constructor(
    public readonly apiKey: Int16,
    public readonly minVersion: Int16,
    public readonly maxVersion: Int16,
    public readonly tagSection: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): ApiKeyV1 {
    return new ApiKeyV1(
      Int16.deserialize(buffer),
      Int16.deserialize(buffer),
      Int16.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
