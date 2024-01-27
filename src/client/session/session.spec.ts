import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { type RequestBuilderTemplate } from '../../protocol/requests/request-builder';
import { type Connection } from './connection';
import { Session } from './session';
import { type SupportedApiVersions } from './supported-api-versions';

describe('Session', () => {
  let connection: DeepMocked<Connection>;
  let requestBuilder: DeepMocked<RequestBuilderTemplate<any>>;

  beforeEach(() => {
    connection = createMock<Connection>();
    requestBuilder = createMock<RequestBuilderTemplate<any>>();
  });

  describe('send', () => {
    it('should throw an error if the API key is not supported', async () => {
      const apiVersions = {} satisfies SupportedApiVersions;

      requestBuilder.getApiKey.mockReturnValue(1);

      const session = new Session(connection, apiVersions);

      await expect(session.send(requestBuilder)).rejects.toThrow('API key not supported: 1');
    });
  });

  describe('isHealthy', () => {
    it('should return the connection health', () => {
      const connectionHealth = true;

      connection.isHealthy.mockReturnValue(connectionHealth);

      const session = new Session(connection, {} satisfies SupportedApiVersions);

      expect(session.isHealthy()).toBe(connectionHealth);
    });
  });
});
