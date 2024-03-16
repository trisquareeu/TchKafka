import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { randomUUID } from 'crypto';
import { type Socket } from 'net';
import { Connection } from '../../../src/client/session';
import {
  ProduceRequestBuilder,
  ProduceRequestV3,
  ProduceRequestV4,
  type SimpleTopic
} from '../../../src/protocol/requests';
import { KafkaContainerUtils } from '../utils/kafka-container-utils';

jest.setTimeout(120_000);

const port = 9092;

describe('ProduceRequest', () => {
  let produceRequestBuilder: ProduceRequestBuilder;
  let socket: Socket;
  let connection: Connection;
  let container: StartedKafkaContainer;
  let kafkaContainerUtils: KafkaContainerUtils;
  let topic: SimpleTopic;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:7.6.0').withExposedPorts(port).withReuse().start();
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
    produceRequestBuilder = new ProduceRequestBuilder('someClientId', null, -1, 30000, [
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
  });

  afterEach(() => {
    socket.destroy();
  });

  describe('v3', () => {
    it('should send the request and properly parse the response', async () => {
      const request = produceRequestBuilder.build(3, 3);
      expect(request).toBeInstanceOf(ProduceRequestV3);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.responses.value?.forEach((response) => {
        expect(response.name.value).toBe(topic.name);
        response.partitionResponses.value?.forEach((partitionResponse) => {
          expect(partitionResponse.errorCode.value).toBe(0);
          expect(partitionResponse.baseOffset.value).toEqual(0n);
        });
      });
    });
  });

  describe('v4', () => {
    it('should send the request and properly parse the response', async () => {
      const request = produceRequestBuilder.build(4, 4);
      expect(request).toBeInstanceOf(ProduceRequestV4);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      response.responses.value?.forEach((response) => {
        expect(response.name.value).toBe(topic.name);
        response.partitionResponses.value?.forEach((partitionResponse) => {
          expect(partitionResponse.errorCode.value).toBe(0);
          expect(partitionResponse.baseOffset.value).toEqual(0n);
        });
      });
    });
  });
});
