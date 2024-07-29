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

  public static async deserialize(buffer: ReadBuffer): Promise<ApiKeyV1> {
    return new ApiKeyV1(
      await Int16.deserialize(buffer),
      await Int16.deserialize(buffer),
      await Int16.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
