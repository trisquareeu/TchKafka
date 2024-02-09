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

    it('should reject the promise if the connection throws an error', async () => {
      const apiVersions = {
        0: {
          min: 0,
          max: 1
        }
      } satisfies SupportedApiVersions;

      requestBuilder.getApiKey.mockReturnValue(0);

      connection.send.mockRejectedValue(new Error('Connection error'));

      const session = new Session(connection, apiVersions);

      await expect(session.send(requestBuilder)).rejects.toThrow('Connection error');
    });
  });
});
