import { type Bytes } from '../../primitives';
import { ResponseHeaderV0, SaslAuthenticateResponseV0 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';

export class SaslAuthenticateRequestV0 implements Request<SaslAuthenticateResponseV0> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = SaslAuthenticateResponseV0;

  constructor(public readonly header: RequestHeaderV1, public readonly authBytes: Bytes) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.authBytes.serialize(buffer);
  }
}
