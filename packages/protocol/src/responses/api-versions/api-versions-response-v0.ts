import { Int16, NonNullableArray } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ApiKeyV0 } from './api-key';

export class ApiVersionsResponseV0Data {
  constructor(
    public readonly errorCode: Int16,
    public readonly apiVersions: NonNullableArray<ApiKeyV0>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ApiVersionsResponseV0Data> {
    return new ApiVersionsResponseV0Data(
      await Int16.deserialize(buffer),
      await NonNullableArray.deserialize(buffer, ApiKeyV0.deserialize)
    );
  }
}
