import { TagSection } from '../../commons';
import { Array, Boolean, CompactArray, Int16, NullableString } from '../../primitives';
import { RequestHeaderV1, RequestHeaderV2 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { MetadataRequestV0 } from './metadata-request-v0';
import { MetadataRequestV1 } from './metadata-request-v1';
import { MetadataRequestV10 } from './metadata-request-v10';
import { MetadataRequestV11 } from './metadata-request-v11';
import { MetadataRequestV12 } from './metadata-request-v12';
import { MetadataRequestV2 } from './metadata-request-v2';
import { MetadataRequestV3 } from './metadata-request-v3';
import { MetadataRequestV4 } from './metadata-request-v4';
import { MetadataRequestV5 } from './metadata-request-v5';
import { MetadataRequestV6 } from './metadata-request-v6';
import { MetadataRequestV7 } from './metadata-request-v7';
import { MetadataRequestV8 } from './metadata-request-v8';
import { MetadataRequestV9 } from './metadata-request-v9';
import { type Topics, TopicsFactory } from './topic';

export type MetadataRequest =
  | MetadataRequestV0
  | MetadataRequestV1
  | MetadataRequestV2
  | MetadataRequestV3
  | MetadataRequestV4
  | MetadataRequestV5
  | MetadataRequestV6
  | MetadataRequestV7
  | MetadataRequestV8
  | MetadataRequestV9
  | MetadataRequestV10
  | MetadataRequestV11
  | MetadataRequestV12;

export class MetadataRequestBuilder extends RequestBuilderTemplate<MetadataRequest> {
  private static readonly apiKey = 3;

  constructor(
    private readonly clientId: string | null,
    private readonly topics: Topics,
    private readonly allowAutoTopicCreation: boolean,
    private readonly includeClusterAuthorizedOperations: boolean,
    private readonly includeTopicAuthorizedOperations: boolean
  ) {
    super(MetadataRequestBuilder.apiKey, 0, 12);
  }

  public getApiKey(): number {
    return MetadataRequestBuilder.apiKey;
  }

  protected buildRequest(_minVersion: number, maxVersion: number): MetadataRequest {
    const topicsFactory = new TopicsFactory(this.topics);

    switch (maxVersion) {
      case 0:
        return new MetadataRequestV0(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(0),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer))
        );
      case 1:
        return new MetadataRequestV1(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(1),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer))
        );
      case 2:
        return new MetadataRequestV2(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(2),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer))
        );
      case 3:
        return new MetadataRequestV3(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(3),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer))
        );
      case 4:
        return new MetadataRequestV4(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(4),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation)
        );
      case 5:
        return new MetadataRequestV5(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(5),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation)
        );
      case 6:
        return new MetadataRequestV6(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(6),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation)
        );
      case 7:
        return new MetadataRequestV7(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(7),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation)
        );
      case 8:
        return new MetadataRequestV8(
          new RequestHeaderV1(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(8),
            new NullableString(this.clientId)
          ),
          new Array(topicsFactory.createStrings(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation),
          new Boolean(this.includeClusterAuthorizedOperations),
          new Boolean(this.includeTopicAuthorizedOperations)
        );
      case 9:
        return new MetadataRequestV9(
          new RequestHeaderV2(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(9),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactArray(topicsFactory.createTopicsV9(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation),
          new Boolean(this.includeClusterAuthorizedOperations),
          new Boolean(this.includeTopicAuthorizedOperations),
          new TagSection()
        );
      case 10:
        return new MetadataRequestV10(
          new RequestHeaderV2(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(10),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactArray(topicsFactory.createTopicsV10(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation),
          new Boolean(this.includeClusterAuthorizedOperations),
          new Boolean(this.includeTopicAuthorizedOperations),
          new TagSection()
        );
      case 11:
        return new MetadataRequestV11(
          new RequestHeaderV2(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(11),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactArray(topicsFactory.createTopicsV10(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation),
          new Boolean(this.includeTopicAuthorizedOperations),
          new TagSection()
        );
      case 12:
      default:
        return new MetadataRequestV12(
          new RequestHeaderV2(
            new Int16(MetadataRequestBuilder.apiKey),
            new Int16(12),
            new NullableString(this.clientId),
            new TagSection()
          ),
          new CompactArray(topicsFactory.createTopicsV10(), (topic, buffer) => topic.serialize(buffer)),
          new Boolean(this.allowAutoTopicCreation),
          new Boolean(this.includeTopicAuthorizedOperations),
          new TagSection()
        );
    }
  }
}
