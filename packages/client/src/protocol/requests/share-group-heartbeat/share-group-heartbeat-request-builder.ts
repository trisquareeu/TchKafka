import { TagSection } from '../../commons';
import { CompactArray, CompactNullableString, CompactString, Int16, Int32, NullableString } from '../../primitives';
import { RequestHeaderV2 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { ShareGroupHeartbeatRequestV1 } from './share-group-heartbeat-request-v1';

export type ShareGroupHeartbeatRequest = ShareGroupHeartbeatRequestV1;

export class ShareGroupHeartbeatRequestBuilder extends RequestBuilderTemplate<ShareGroupHeartbeatRequest> {
  private static readonly apiKey = 76;

  constructor(
    private readonly clientId: string,
    private readonly groupId: string,
    private readonly memberId: string,
    private readonly memberEpoch: number,
    private readonly rackId: string | null,
    private readonly rebalanceTimeoutMs: number,
    private readonly subscribedTopicNames: string[] | null
  ) {
    super(ShareGroupHeartbeatRequestBuilder.apiKey, 1, 1);
  }

  public override getApiKey(): number {
    return ShareGroupHeartbeatRequestBuilder.apiKey;
  }

  protected override buildRequest(_minVersion: number, _maxVersion: number): ShareGroupHeartbeatRequestV1 {
    return new ShareGroupHeartbeatRequestV1(
      new RequestHeaderV2(
        new Int16(ShareGroupHeartbeatRequestBuilder.apiKey),
        new Int16(1),
        new NullableString(this.clientId),
        new TagSection()
      ),
      new CompactString(this.groupId),
      new CompactString(this.memberId),
      new Int32(this.memberEpoch),
      new CompactNullableString(this.rackId),
      new Int32(this.rebalanceTimeoutMs),
      new CompactArray(
        this.subscribedTopicNames === null ? null : this.subscribedTopicNames.map((name) => new CompactString(name)),
        (topic, buffer) => topic.serialize(buffer)
      ),
      new TagSection()
    );
  }
}
