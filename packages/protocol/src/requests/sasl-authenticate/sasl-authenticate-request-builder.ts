import { Bytes, Int16, NullableString } from '../../primitives';
import { RequestHeaderV1 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { SaslAuthenticateRequestV0 } from './sasl-authenticate-request-v0';

export type SaslAuthenticateRequest = SaslAuthenticateRequestV0;

export class SaslAuthenticateRequestBuilder extends RequestBuilderTemplate<SaslAuthenticateRequest> {
  public static readonly apiKey = 36;

  constructor(
    private readonly authBytes: Buffer,
    private readonly clientId: string | null
  ) {
    super(SaslAuthenticateRequestBuilder.apiKey, 0, 0);
  }

  protected buildRequest(_minVersion: number, _maxVersion: number): SaslAuthenticateRequestV0 {
    return new SaslAuthenticateRequestV0(
      new RequestHeaderV1(
        new Int16(SaslAuthenticateRequestBuilder.apiKey),
        new Int16(0),
        new NullableString(this.clientId)
      ),
      new Bytes(this.authBytes)
    );
  }
}
