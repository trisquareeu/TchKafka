import { Int32, Int16, NonNullableArray } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ApiKeyV0 } from './api-key';

export class ApiVersionsResponseV1Data {
  constructor(
    public readonly errorCode: Int16,
    public readonly apiVersions: NonNullableArray<ApiKeyV0>,
    public readonly maxThrottleTime: Int32
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ApiVersionsResponseV1Data> {
    return new ApiVersionsResponseV1Data(
      await Int16.deserialize(buffer),
      await NonNullableArray.deserialize(buffer, ApiKeyV0.deserialize),
      await Int32.deserialize(buffer)
    );
  }
}
