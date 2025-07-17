import { type Array, type Int32, type Int8 } from '../../primitives';
import { ResponseHeaderV0 } from '../../responses';
import { FetchResponseV4Data } from '../../responses/fetch/fetch-response-v4';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';
import { type TopicV7 } from './topic';

export class FetchRequestV4 implements Request<FetchResponseV4Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = FetchResponseV4Data;

  constructor(
    public readonly header: RequestHeaderV1,
    public readonly replicaId: Int32,
    public readonly maxWaitTime: Int32,
    public readonly minBytes: Int32,
    public readonly maxBytes: Int32,
    public readonly isolationLevel: Int8,
    public readonly topics: Array<TopicV7>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.replicaId.serialize(buffer);
    await this.maxWaitTime.serialize(buffer);
    await this.minBytes.serialize(buffer);
    await this.maxBytes.serialize(buffer);
    await this.isolationLevel.serialize(buffer);
    await this.topics.serialize(buffer);
  }
}
