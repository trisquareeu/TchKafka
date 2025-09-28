import { type TagSection } from '../../commons';
import { type CompactArray, type CompactNullableString, type CompactString, type Int32 } from '../../primitives';
import { ShareGroupHeartbeatResponseV1Data, ResponseHeaderV1 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV2 } from '../headers';
import { type Request } from '../request';

export class ShareGroupHeartbeatRequestV1 implements Request<ShareGroupHeartbeatResponseV1Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV1;
  public readonly ExpectedResponseDataClass = ShareGroupHeartbeatResponseV1Data;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly groupId: CompactString,
    public readonly memberId: CompactString,
    public readonly memberEpoch: Int32,
    public readonly rackId: CompactNullableString,
    public readonly rebalanceTimeoutMs: Int32,
    public readonly subscribedTopicNames: CompactArray<CompactString>,
    public readonly tags: TagSection
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.groupId.serialize(buffer);
    await this.memberId.serialize(buffer);
    await this.memberEpoch.serialize(buffer);
    await this.rackId.serialize(buffer);
    await this.rebalanceTimeoutMs.serialize(buffer);
    await this.subscribedTopicNames.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}
