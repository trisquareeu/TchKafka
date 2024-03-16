/* eslint-disable @typescript-eslint/no-array-constructor */
import { TagSection } from '../../commons';
import { Array, CompactArray, CompactNullableString, Int16, Int32, NullableString } from '../../primitives';
import { RequestHeaderV1, RequestHeaderV2 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { ProduceRequestV10 } from './produce-request-v10';
import { ProduceRequestV3 } from './produce-request-v3';
import { ProduceRequestV4 } from './produce-request-v4';
import { ProduceRequestV5 } from './produce-request-v5';
import { ProduceRequestV6 } from './produce-request-v6';
import { ProduceRequestV7 } from './produce-request-v7';
import { ProduceRequestV8 } from './produce-request-v8';
import { ProduceRequestV9 } from './produce-request-v9';
import {
  TopicDataV3Factory,
  TopicDataV4Factory,
  type TopicData,
  TopicDataV5Factory,
  TopicDataV6Factory,
  TopicDataV7Factory,
  TopicDataV8Factory,
  TopicDataV9Factory,
  TopicDataV10Factory
} from './topic-data';

export type ProduceRequest =
  | ProduceRequestV3
  | ProduceRequestV4
  | ProduceRequestV5
  | ProduceRequestV6
  | ProduceRequestV7
  | ProduceRequestV8
  | ProduceRequestV9;

export class ProduceRequestBuilder extends RequestBuilderTemplate<ProduceRequest> {
  private static readonly apiKey = 0;

  constructor(
    private readonly clientId: string | null,
    private readonly transactionalId: string | null,
    private readonly acks: number,
    private readonly timeout: number,
    private readonly topicData: TopicData[]
  ) {
    super(ProduceRequestBuilder.apiKey, 3, 10);
  }

  public getApiKey(): number {
    return ProduceRequestBuilder.apiKey;
  }

  public expectResponse(): boolean {
    return this.acks !== 0;
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
      case 5:
        return new ProduceRequestV5(
          new RequestHeaderV1(new Int16(ProduceRequestBuilder.apiKey), new Int16(5), new NullableString(this.clientId)),
          new NullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new Array(
            this.topicData.map((entry) => new TopicDataV5Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
      case 6:
        return new ProduceRequestV6(
          new RequestHeaderV1(new Int16(ProduceRequestBuilder.apiKey), new Int16(6), new NullableString(this.clientId)),
          new NullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new Array(
            this.topicData.map((entry) => new TopicDataV6Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
      case 7:
        return new ProduceRequestV7(
          new RequestHeaderV1(new Int16(ProduceRequestBuilder.apiKey), new Int16(7), new NullableString(this.clientId)),
          new NullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new Array(
            this.topicData.map((entry) => new TopicDataV7Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
      case 8:
        return new ProduceRequestV8(
          new RequestHeaderV1(new Int16(ProduceRequestBuilder.apiKey), new Int16(8), new NullableString(this.clientId)),
          new NullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new Array(
            this.topicData.map((entry) => new TopicDataV8Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
      case 9:
        return new ProduceRequestV9(
          new RequestHeaderV2(
            new Int16(ProduceRequestBuilder.apiKey),
            new Int16(9),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactNullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new CompactArray(
            this.topicData.map((entry) => new TopicDataV9Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
      case 10:
      default:
        return new ProduceRequestV10(
          new RequestHeaderV2(
            new Int16(ProduceRequestBuilder.apiKey),
            new Int16(10),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactNullableString(this.transactionalId),
          new Int16(this.acks),
          new Int32(this.timeout),
          new CompactArray(
            this.topicData.map((entry) => new TopicDataV10Factory(entry).create()),
            (topicData, buffer) => topicData.serialize(buffer)
          )
        );
    }
  }
}
