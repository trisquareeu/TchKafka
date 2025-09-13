import {
  ConsumerGroupHeartbeatRequestBuilder,
  ConsumerGroupHeartbeatRequestV1,
  FindCoordinatorRequestBuilder
} from '@tchkafka/protocol';
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { type Socket } from 'net';
import { Connection } from '../../../src/session';
import { KafkaContainerUtils } from '../utils/kafka-container-utils';
import { randomUUID } from 'crypto';
import { waitFor } from '../utils/wait-for';

jest.setTimeout(120_000);

const port = 9092;

describe('ConsumerGroupHeartbeatRequest', () => {
  let consumerGroupHeartbeatRequestBuilder: ConsumerGroupHeartbeatRequestBuilder;
  let socket: Socket;
  let connection: Connection;
  let container: StartedKafkaContainer;
  let kafkaContainerUtils: KafkaContainerUtils;
  let topicId: string;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:8.0.0').withExposedPorts(port).start();
    kafkaContainerUtils = new KafkaContainerUtils(container);
    topicId = randomUUID();

    await kafkaContainerUtils.createTopic(topicId);
  });

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    socket = await kafkaContainerUtils.getConnectedSocket(port);
    connection = new Connection(socket);
    consumerGroupHeartbeatRequestBuilder = new ConsumerGroupHeartbeatRequestBuilder(
      'tchKafka',
      'someGroupId',
      randomUUID(),
      0,
      null,
      null,
      30000,
      [topicId],
      null,
      []
    );
  });

  afterEach(() => {
    socket.destroy();
  });

  describe('v1', () => {
    it('should send the request and properly parse the response', async () => {
      const request = consumerGroupHeartbeatRequestBuilder.build(1, 1);

      // the consumer metadata must be present to get the assignment from broker
      await waitFor(async () => {
        const findCoordinatorRequestBuilder = new FindCoordinatorRequestBuilder('tchkafka', 0, ['someGroupId']);
        const request = findCoordinatorRequestBuilder.build(6, 6);
        const response = await connection.send(request);
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        expect(response.coordinators.value![0]!.errorCode!.value).toBe(0);
        expect(response.coordinators.value![0]!.host.value).toBeDefined();
        expect(response.coordinators.value![0]!.port.value).toBe(9092);
      });

      expect(request).toBeInstanceOf(ConsumerGroupHeartbeatRequestV1);

      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
    });
  });
});
