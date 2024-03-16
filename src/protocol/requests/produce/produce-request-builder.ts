/* eslint-disable @typescript-eslint/no-array-constructor */
import { Array, Int16, Int32, NullableString } from '../../primitives';
import { RequestHeaderV1 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { ProduceRequestV3 } from './produce-request-v3';
import { ProduceRequestV4 } from './produce-request-v4';
import { TopicDataV3Factory, TopicDataV4Factory, type TopicData } from './topic-data';

export type ProduceRequest = ProduceRequestV3;

export class ProduceRequestBuilder extends RequestBuilderTemplate<ProduceRequest> {
  private static readonly apiKey = 0;

  constructor(
    private readonly clientId: string | null,
    private readonly transactionalId: string | null,
    private readonly acks: number,
    private readonly timeout: number,
    private readonly topicData: TopicData[]
  ) {
    super(ProduceRequestBuilder.apiKey, 3, 4);
  }

  public getApiKey(): number {
    return ProduceRequestBuilder.apiKey;
  }

  protected buildRequest(_minVersion: number, maxVersion: number): ProduceRequest {
    switch (maxVersion) {
      case 3:
        return new ProduceRequestV3(
          new RequestHeaderV1(new Int16(ProduceRequestBuilder.apiKey), new Int16(3), new NullableString(this.clientId)),
          new NullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new Array(
            this.topicData.map((entry) => new TopicDataV3Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
      case 4:
      default:
        return new ProduceRequestV4(
          new RequestHeaderV1(new Int16(ProduceRequestBuilder.apiKey), new Int16(4), new NullableString(this.clientId)),
          new NullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new Array(
            this.topicData.map((entry) => new TopicDataV4Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
    }
  }
}
