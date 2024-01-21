import { TagSection } from '../../commons';
import { CompactString, Int16, NullableString } from '../../primitives';
import { RequestHeaderV1, RequestHeaderV2 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { ApiVersionsRequestV0 } from './api-versions-request-v0';
import { ApiVersionsRequestV1 } from './api-versions-request-v1';
import { ApiVersionsRequestV2 } from './api-versions-request-v2';
import { ApiVersionsRequestV3 } from './api-versions-request-v3';

export type ApiVersionsRequest =
  | ApiVersionsRequestV0
  | ApiVersionsRequestV1
  | ApiVersionsRequestV2
  | ApiVersionsRequestV3;

export class ApiVersionsRequestBuilder extends RequestBuilderTemplate<ApiVersionsRequest> {
  private static readonly apiKey = 18;

  constructor(
    private readonly clientId: string | null,
    private readonly clientSoftwareName: string,
    private readonly clientSoftwareVersion: string
  ) {
    super(ApiVersionsRequestBuilder.apiKey, 0, 3);
  }

  protected buildRequest(_minVersion: number, maxVersion: number): ApiVersionsRequest {
    switch (maxVersion) {
      case 0:
        return new ApiVersionsRequestV0(
          new RequestHeaderV1(
            new Int16(ApiVersionsRequestBuilder.apiKey),
            new Int16(0),
            new NullableString(this.clientId)
          )
        );
      case 1:
        return new ApiVersionsRequestV1(
          new RequestHeaderV1(
            new Int16(ApiVersionsRequestBuilder.apiKey),
            new Int16(1),
            new NullableString(this.clientId)
          )
        );
      case 2:
        return new ApiVersionsRequestV2(
          new RequestHeaderV1(
            new Int16(ApiVersionsRequestBuilder.apiKey),
            new Int16(2),
            new NullableString(this.clientId)
          )
        );
      case 3:
      default:
        return new ApiVersionsRequestV3(
          new RequestHeaderV2(
            new Int16(ApiVersionsRequestBuilder.apiKey),
            new Int16(3),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactString(this.clientSoftwareName),
          new CompactString(this.clientSoftwareVersion),
          new TagSection()
        );
    }
  }
}
