import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { randomUUID } from 'crypto';
import { type Socket } from 'net';
import { Connection } from '../../../src/client/session';
import {
  ProduceRequestBuilder,
  ProduceRequestV10,
  ProduceRequestV3,
  ProduceRequestV4,
  ProduceRequestV5,
  ProduceRequestV8,
  ProduceRequestV9,
  type SimpleTopic
} from '../../../src/protocol/requests';
import { KafkaContainerUtils } from '../utils/kafka-container-utils';
import { ProduceRequestV6 } from '../../../src/protocol/requests/produce/produce-request-v6';
import { ProduceRequestV7 } from '../../../src/protocol/requests/produce/produce-request-v7';

jest.setTimeout(120_000);

const port = 9092;

describe('ProduceRequest', () => {
  let socket: Socket;
  let connection: Connection;
  let container: StartedKafkaContainer;
  let kafkaContainerUtils: KafkaContainerUtils;
  let topic: SimpleTopic;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:7.5.4').withExposedPorts(port).start();
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
  });

  afterEach(() => {
    socket.destroy();
  });

  const allAcks = [-1, 0, 1] as const;

  describe('v3', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(3, 3);
      expect(request).toBeInstanceOf(ProduceRequestV3);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  describe('v4', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(4, 4);
      expect(request).toBeInstanceOf(ProduceRequestV4);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  describe('v5', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(5, 5);
      expect(request).toBeInstanceOf(ProduceRequestV5);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  describe('v6', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(6, 6);
      expect(request).toBeInstanceOf(ProduceRequestV6);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  describe('v7', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(7, 7);
      expect(request).toBeInstanceOf(ProduceRequestV7);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  describe('v8', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(8, 8);
      expect(request).toBeInstanceOf(ProduceRequestV8);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  describe('v9', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(9, 9);
      expect(request).toBeInstanceOf(ProduceRequestV9);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  // not supported by the container yet
  describe.skip('v10', () => {
    it.each(allAcks)('should send the request and properly parse the response for acks: %d', async (acks) => {
      const produceRequestBuilder = createProduceRequestBuilder(acks);
      const request = produceRequestBuilder.build(10, 10);
      expect(request).toBeInstanceOf(ProduceRequestV10);

      const response = await connection.send(request, acks !== 0);

      if (acks !== 0) {
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        response!.responses.value?.forEach((response) => {
          expect(response.name.value).toBe(topic.name);
          response.partitionResponses.value?.forEach((partitionResponse) => {
            expect(partitionResponse.errorCode.value).toBe(0);
            expect(partitionResponse.baseOffset.value).toEqual(0n);
          });
        });
      } else {
        expect(response).toBeUndefined();
      }
    });
  });

  function createProduceRequestBuilder(acks: -1 | 0 | 1): ProduceRequestBuilder {
    return new ProduceRequestBuilder('someClientId', null, acks, 30000, [
      {
        name: topic.name,
        partitionData: [
          {
            index: 0,
            records: [
              {
                key: Buffer.from('key-9d0f348cb2e730e1edc4'),
                value: Buffer.from('some-value-a17b4c81f9ecd1e896e3'),
                timestamp: 1509928155660,
                headers: { a: 'b', c: ['d', 'e'] }
              },
              {
                key: Buffer.from('key-c7073e965c34b4cc6442'),
                value: Buffer.from('some-value-65df422070d7ad73914f'),
                timestamp: 1509928155660,
                headers: { a: 'b' }
              },
              {
                key: Buffer.from('key-1693b184a9b52dbe03bc'),
                value: Buffer.from('some-value-3fcb65ffca087cba20ad'),
                timestamp: 1509928155660,
                headers: { a: 'b' }
              }
            ]
          }
        ]
      }
    ]);
  }
});
