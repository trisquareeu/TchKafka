import { type Array, type Int32, type Int8 } from '../../primitives';
import { ResponseHeaderV0 } from '../../responses';
import { FetchResponseV7Data } from '../../responses/fetch/fetch-response-v7';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';
import { type TopicV7 } from './topic';

export class FetchRequestV7 implements Request<FetchResponseV7Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = FetchResponseV7Data;

  constructor(
    public readonly header: RequestHeaderV1,
    public readonly replicaId: Int32,
    public readonly maxWaitTime: Int32,
    public readonly minBytes: Int32,
    public readonly maxBytes: Int32,
    public readonly isolationLevel: Int8,
    public readonly sessionId: Int32,
    public readonly sessionEpoch: Int32,
    public readonly topics: Array<TopicV7>,
    public readonly forgottenTopicsData: Array<any>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.replicaId.serialize(buffer);
    await this.maxWaitTime.serialize(buffer);
    await this.minBytes.serialize(buffer);
    await this.maxBytes.serialize(buffer);
    await this.isolationLevel.serialize(buffer);
    await this.sessionId.serialize(buffer);
    await this.sessionEpoch.serialize(buffer);
    await this.topics.serialize(buffer);
    await this.forgottenTopicsData.serialize(buffer);
  }
}
