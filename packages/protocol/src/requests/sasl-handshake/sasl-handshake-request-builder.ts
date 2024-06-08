import { Int16, NullableString, String } from '../../primitives';
import { RequestHeaderV1 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { SaslHandshakeRequestV1 } from './sasl-handshake-request-v1';

export type SaslHandshakeRequest = SaslHandshakeRequestV1;

export class SaslHandshakeRequestBuilder extends RequestBuilderTemplate<SaslHandshakeRequest> {
  public static readonly apiKey = 17;

  constructor(
    private readonly mechanism: string,
    private readonly clientId: string | null
  ) {
    super(SaslHandshakeRequestBuilder.apiKey, 0, 1);
  }

  public override getApiKey(): number {
    return SaslHandshakeRequestBuilder.apiKey;
  }

  protected buildRequest(_minVersion: number, maxVersion: number): SaslHandshakeRequestV1 {
    switch (maxVersion) {
      case 0:
        return new SaslHandshakeRequestV1(
          new RequestHeaderV1(
            new Int16(SaslHandshakeRequestBuilder.apiKey),
            new Int16(0),
            new NullableString(this.clientId)
          ),
          new String(this.mechanism)
        );
      case 1:
      default:
        return new SaslHandshakeRequestV1(
          new RequestHeaderV1(
            new Int16(SaslHandshakeRequestBuilder.apiKey),
            new Int16(1),
            new NullableString(this.clientId)
          ),
          new String(this.mechanism)
        );
    }
  }
}
