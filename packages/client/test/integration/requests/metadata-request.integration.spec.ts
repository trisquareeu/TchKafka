import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { type Socket } from 'net';

import { KafkaContainerUtils } from '../utils/kafka-container-utils';
import { randomUUID } from 'crypto';
import {
  MetadataRequestBuilder,
  type SimpleTopic,
  MetadataRequestV0,
  MetadataRequestV1,
  MetadataRequestV2,
  MetadataRequestV3,
  MetadataRequestV4,
  MetadataRequestV5,
  MetadataRequestV6,
  MetadataRequestV7,
  MetadataRequestV8,
  MetadataRequestV9,
  MetadataRequestV10,
  MetadataRequestV11,
  MetadataRequestV12,
  type MetadataResponseV12Data
} from '../../../src/protocol';
import { Connection } from '../../../src/session';

jest.setTimeout(120_000);

const port = 9092;

describe('MetadataRequest', () => {
  let metadataRequestBuilder: MetadataRequestBuilder;
  let socket: Socket;
  let connection: Connection;
  let container: StartedKafkaContainer;
  let kafkaContainerUtils: KafkaContainerUtils;
  let topic: SimpleTopic;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:7.6.0').withExposedPorts(port).start();
    kafkaContainerUtils = new KafkaContainerUtils(container);
  });

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    socket = await kafkaContainerUtils.getConnectedSocket(port);
    connection = new Connection(socket);
    topic = { name: `topic-${randomUUID()}` };
    await kafkaContainerUtils.createTopic(topic.name);
    metadataRequestBuilder = new MetadataRequestBuilder('someClientId', [topic], false, true, true);
  });

  afterEach(() => {
    socket.destroy();
  });

  describe('v0', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(0, 0);
      expect(request).toBeInstanceOf(MetadataRequestV0);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v1', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(1, 1);
      expect(request).toBeInstanceOf(MetadataRequestV1);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v2', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(2, 2);
      expect(request).toBeInstanceOf(MetadataRequestV2);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v3', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(3, 3);
      expect(request).toBeInstanceOf(MetadataRequestV3);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v4', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(4, 4);
      expect(request).toBeInstanceOf(MetadataRequestV4);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v5', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(5, 5);
      expect(request).toBeInstanceOf(MetadataRequestV5);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v6', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(6, 6);
      expect(request).toBeInstanceOf(MetadataRequestV6);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v7', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(7, 7);
      expect(request).toBeInstanceOf(MetadataRequestV7);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v8', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(8, 8);
      expect(request).toBeInstanceOf(MetadataRequestV8);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v9', () => {
    it('should send the request and properly parse the response', async () => {
      const request = metadataRequestBuilder.build(9, 9);
      expect(request).toBeInstanceOf(MetadataRequestV9);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v10', () => {
    it('should send the request and properly parse the response', async () => {
      const metadataRequestBuilder = new MetadataRequestBuilder('someClientId', [topic], false, true, true);
      const request = metadataRequestBuilder.build(10, 10);
      expect(request).toBeInstanceOf(MetadataRequestV10);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v11', () => {
    it('should send the request and properly parse the response', async () => {
      const metadataRequestBuilder = new MetadataRequestBuilder('someClientId', [topic], false, true, true);
      const request = metadataRequestBuilder.build(11, 11);
      expect(request).toBeInstanceOf(MetadataRequestV11);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });

  describe('v12', () => {
    it('should send the request and properly parse the response', async () => {
      const metadataRequestBuilder = new MetadataRequestBuilder('someClientId', [topic], false, true, true);
      const request = metadataRequestBuilder.build(12, 12);
      expect(request).toBeInstanceOf(MetadataRequestV12);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });

      const metadataRequestBuilderWithId = new MetadataRequestBuilder(
        'someClientId',
        [
          {
            name: topic.name,
            id: (response as MetadataResponseV12Data).topics.value![0]!.topicId.toString()
          }
        ],
        false,
        true,
        true
      );

      const requestWithId = metadataRequestBuilderWithId.build(12, 12);
      const responseWithId = await connection.send(requestWithId);

      expect(responseWithId).toBeInstanceOf(request.ExpectedResponseDataClass);
      responseWithId.topics.value?.forEach((topic) => {
        expect(topic.errorCode.value).toBe(0);
      });
    });
  });
});
