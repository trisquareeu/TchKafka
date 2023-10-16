import { createConnection, type Socket } from 'net';
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { Connection } from '../../../src/connection/connection';
import {
  ApiVersionsRequestV0,
  ApiVersionsRequestV1,
  ApiVersionsRequestV2,
  ApiVersionsRequestV3
} from '../../../src/protocol/requests';
import { CompactString } from '../../../src/protocol/primitives';

jest.setTimeout(120_000);

const port = 9092;

describe('ApiVersionsRequest', () => {
  let socket: Socket;
  let connection: Connection;
  let container: StartedKafkaContainer;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:7.3.2').withExposedPorts(port).withReuse().start();
  });

  afterAll(async () => {
    container.stop();
  });

  beforeEach(async () => {
    socket = await createConnectedSocket(container.getHost(), container.getMappedPort(port));
    connection = new Connection(socket);
  });

  afterEach(() => {
    socket.destroy();
  });

  describe('v0', () => {
    it('should send the request and properly parse the response', async () => {
      const request = new ApiVersionsRequestV0();
      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
    });
  });

  describe('v1', () => {
    it('should send the request and properly parse the response', async () => {
      const request = new ApiVersionsRequestV1();
      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
    });
  });

  describe('v2', () => {
    it('should send the request and properly parse the response', async () => {
      const request = new ApiVersionsRequestV2();
      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
    });
  });

  describe('v3', () => {
    it('should send the request and properly parse the response', async () => {
      const request = new ApiVersionsRequestV3(new CompactString('the-best-kafka-client'), new CompactString('1.0.0'));
      const response = await connection.send(request);

      expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);
    });
  });
});

function createConnectedSocket(host: string, port: number): Promise<Socket> {
  const socket = createConnection(port, host);

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      resolve(socket);
    });

    socket.on('error', (error) => {
      reject(error);
    });
  });
}
