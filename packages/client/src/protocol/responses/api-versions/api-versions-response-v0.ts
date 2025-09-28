import { Int16, NonNullableArray } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ApiKeyV0 } from './api-key';

export class ApiVersionsResponseV0Data {
  constructor(
    public readonly errorCode: Int16,
    public readonly apiVersions: NonNullableArray<ApiKeyV0>
  ) {}

  public static deserialize(buffer: ReadBuffer): ApiVersionsResponseV0Data {
    return new ApiVersionsResponseV0Data(
      Int16.deserialize(buffer),
      NonNullableArray.deserialize(buffer, ApiKeyV0.deserialize)
    );
  }
}
