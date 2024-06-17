import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { ApiVersionsRequestBuilder } from '@tchkafka/protocol';
import { type SessionOptions, SessionBuilder, NoOpAuthenticator, TcpSocketFactory } from '../../../src/session';

jest.setTimeout(120_000);

const port = 9092;

describe('Session', () => {
  let container: StartedKafkaContainer;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:7.3.2').withExposedPorts(port).start();
  });

  afterAll(async () => {
    await container.stop();
  });

  describe('tcp', () => {
    const socketFactory = new TcpSocketFactory();
    const clientOptions: SessionOptions = {
      clientId: 'tchkafka1',
      clientSoftwareName: 'tchkafka',
      clientSoftwareVersion: '1.0.0',
      connectionTimeout: 5000
    };

    it('should create a session', async () => {
      const sessionBuilder = new SessionBuilder(socketFactory, new NoOpAuthenticator(), clientOptions);
      const session = await sessionBuilder.newSession(container.getMappedPort(port), container.getHost());
      expect(session).toBeDefined();
    });

    it('should send a request and receive a response', async () => {
      const sessionBuilder = new SessionBuilder(socketFactory, new NoOpAuthenticator(), clientOptions);
      const requestBuilder = new ApiVersionsRequestBuilder(
        clientOptions.clientId,
        clientOptions.clientSoftwareName,
        clientOptions.clientSoftwareVersion
      );

      const session = await sessionBuilder.newSession(container.getMappedPort(port), container.getHost());
      const response = await session.send(requestBuilder);

      expect(response).toBeDefined();
      expect(response!.errorCode.value).toBe(0);
      expect(response!.apiVersions.value?.length).toBeGreaterThan(0);
    });
  });
});
