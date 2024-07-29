import { TagSection } from '../../commons';
import { Int32, Int16, CompactArray } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ApiKeyV1 } from './api-key';

export class ApiVersionsResponseV3Data {
  constructor(
    public readonly errorCode: Int16,
    public readonly apiVersions: CompactArray<ApiKeyV1>,
    public readonly maxThrottleTime: Int32,
    public readonly tagSection: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ApiVersionsResponseV3Data> {
    return new ApiVersionsResponseV3Data(
      await Int16.deserialize(buffer),
      await CompactArray.deserialize(buffer, ApiKeyV1.deserialize),
      await Int32.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
