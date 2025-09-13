import { FindCoordinatorRequestBuilder, FindCoordinatorRequestV6 } from '@tchkafka/protocol';
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { type Socket } from 'net';
import { Connection } from '../../../src/session';
import { KafkaContainerUtils } from '../utils/kafka-container-utils';
import { waitFor } from '../utils/wait-for';

jest.setTimeout(120_000);

const port = 9092;

describe('FindCoordinatorRequest', () => {
  let findCoordinatorRequestBuilder: FindCoordinatorRequestBuilder;
  let socket: Socket;
  let connection: Connection;
  let container: StartedKafkaContainer;
  let kafkaContainerUtils: KafkaContainerUtils;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:8.0.0').withExposedPorts(port).start();
    kafkaContainerUtils = new KafkaContainerUtils(container);
  });

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    socket = await kafkaContainerUtils.getConnectedSocket(port);
    connection = new Connection(socket);
    findCoordinatorRequestBuilder = new FindCoordinatorRequestBuilder('tchkafka', 0, ['test-group']);
  });

  afterEach(() => {
    socket.destroy();
  });

  describe('v6', () => {
    it('should send the request and properly parse the response', async () => {
      const request = findCoordinatorRequestBuilder.build(6, 6);
      expect(request).toBeInstanceOf(FindCoordinatorRequestV6);

      let response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
      expect(response.coordinators.value![0]!.errorCode!.value).toBe(15); // COORDINATOR_NOT_AVAILABLE

      await waitFor(async () => {
        response = await connection.send(request);
        expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
        expect(response.coordinators.value![0]!.errorCode!.value).toBe(0);
        expect(response.coordinators.value![0]!.host.value).toBeDefined();
        expect(response.coordinators.value![0]!.port.value).toBe(9092);
      });
    });
  });
});
