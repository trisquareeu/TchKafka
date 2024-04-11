import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { type SessionBuilder, type Session } from './session';
import { Client } from './client';
import { type RequestBuilderTemplate } from '../protocol/requests/request-builder';

describe('Client', () => {
  let sessionBuilder: DeepMocked<SessionBuilder>;
  let requestBuilder: DeepMocked<RequestBuilderTemplate<any>>;

  beforeEach(() => {
    sessionBuilder = createMock<SessionBuilder>();
    requestBuilder = createMock<RequestBuilderTemplate<any>>();
  });

  describe('send', () => {
    it('should reject the promise if the session throws an error', async () => {
      const session = createMock<Session>();
      sessionBuilder.newSession.mockResolvedValue(session);
      const error = new Error('Session error');

      session.send.mockRejectedValue(error);

      const client = new Client('localhost', 1234, sessionBuilder);

      await expect(client.sendWithoutResponse(requestBuilder)).rejects.toThrow(error);
    });
  });
});
