import { type Array, type Int16, type Int32, type NullableString } from '../../primitives';
import { ProduceResponseV6Data, ResponseHeaderV0 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';
import { type TopicDataV6 } from './topic-data';

export class ProduceRequestV6 implements Request<ProduceResponseV6Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = ProduceResponseV6Data;

  constructor(
    public readonly header: RequestHeaderV1,
    public readonly transactionalId: NullableString,
    public readonly acks: Int16,
    public readonly timeout: Int32,
    public readonly topicData: Array<TopicDataV6>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.transactionalId.serialize(buffer);
    await this.acks.serialize(buffer);
    await this.timeout.serialize(buffer);
    await this.topicData.serialize(buffer);
  }
}
