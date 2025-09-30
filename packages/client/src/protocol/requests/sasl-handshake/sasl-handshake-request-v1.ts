import { type String } from '../../primitives';
import { ResponseHeaderV0, SaslHandshakeResponseV1 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';

export class SaslHandshakeRequestV1 implements Request<SaslHandshakeResponseV1> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = SaslHandshakeResponseV1;

  constructor(
    public readonly header: RequestHeaderV1,
    public readonly mechanism: String
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.mechanism.serialize(buffer);
  }
}
