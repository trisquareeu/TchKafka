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

  public static deserialize(buffer: ReadBuffer): ApiVersionsResponseV3Data {
    return new ApiVersionsResponseV3Data(
      Int16.deserialize(buffer),
      CompactArray.deserialize(buffer, ApiKeyV1.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
