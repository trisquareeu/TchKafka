import { FetchRequestBuilder, FetchRequestV7, type SimpleTopic } from '@tchkafka/protocol';
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { randomUUID } from 'crypto';
import { type Socket } from 'net';
import { Connection } from '../../../src/session';

import { KafkaContainerUtils } from '../utils/kafka-container-utils';

jest.setTimeout(120_000);

const port = 9092;

describe.only('FetchRequest', () => {
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

  describe('v7', () => {
    it('should fetch data from an empty topic', async () => {
      const requestBuilder = new FetchRequestBuilder('tchkafka-client', -1, 1000, 0, 1000, 1, 0, -1, [
        {
          name: topic.name,
          partitions: [{ partition: 0, fetchOffset: 0n, logStartOffset: 0n, partitionMaxBytes: 100000 }]
        }
      ]);
      const request = requestBuilder.build(7, 7);
      expect(request).toBeInstanceOf(FetchRequestV7);

      const response = await connection.send(request);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      expect(response.responses.value![0]!.partitions.value![0]!.recordBatches).toHaveLength(0);
    });

    it('should fetch data from a topic with records', async () => {
      const numberOfBatches = 3;
      for (let i = 0; i < numberOfBatches; i++) {
        await kafkaContainerUtils.generateMessage(topic.name);
      }

      const requestBuilder = new FetchRequestBuilder('tchkafka-client', -1, 1000, 0, 10000, 1, 0, -1, [
        {
          name: topic.name,
          partitions: [{ partition: 0, fetchOffset: 0n, logStartOffset: 0n, partitionMaxBytes: 1000 }]
        }
      ]);
      const request = requestBuilder.build(7, 7);
      expect(request).toBeInstanceOf(FetchRequestV7);

      const response = await connection.send(request);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      expect(response.responses.value![0]!.partitions.value![0]!.recordBatches).toHaveLength(numberOfBatches);
    });
  });
});
