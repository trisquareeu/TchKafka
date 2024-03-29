import { ScramCredentials } from './scram-credentials';
import { Sha512 } from './hash-function';
import { ServerFirstMessage } from './server-first-message';
import { ScramMechanism } from './scram-mechanism';

describe('ScramAuthentication', () => {
  it('should create unique nonce everytime authentication is created', async () => {
    const credentials = new ScramCredentials(Buffer.from('username'), Buffer.from('password'));
    const clientFirstMessages = new Set<string>();

    for (let i = 0; i < 10; i++) {
      const auth = await ScramMechanism.next(credentials, Sha512);
      clientFirstMessages.add(auth.getClientFirstMessage());
    }

    expect(clientFirstMessages.size).toBe(10);
  });

  it('should create client first message in correct format', async () => {
    const username = 'username';
    const credentials = new ScramCredentials(Buffer.from(username), Buffer.from('password'));
    const auth = await ScramMechanism.next(credentials, Sha512);
    const clientFirstMessage = auth.getClientFirstMessage();

    expect(clientFirstMessage).toMatch(
      new RegExp(`^n,,n=${username},r=(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$`)
    );
  });

  it('should return client final message in expected format', async () => {
    const username = 'username';
    const credentials = new ScramCredentials(Buffer.from(username), Buffer.from('password'));
    const auth = await ScramMechanism.next(credentials, Sha512);

    const clientFirstMessage = auth.getClientFirstMessage();
    const clientNonce = clientFirstMessage.split('r=')[1];
    const serverNonce = `${clientNonce}serverNonce`;
    const serverFirstMessage = `r=${serverNonce},s=${Buffer.from('serversalt').toString('base64')},i=4096`;
    const clientFinalMessage = await auth.getClientFinalMessage(new ServerFirstMessage(serverFirstMessage));

    const escapedServerNonce = serverNonce.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    expect(clientFinalMessage).toMatch(
      new RegExp(`^c=biws,r=${escapedServerNonce},p=(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$`)
    );
  });

  it('should throw when server requested less than 4096 iterations', async () => {
    const username = 'username';
    const credentials = new ScramCredentials(Buffer.from(username), Buffer.from('password'));
    const auth = await ScramMechanism.next(credentials, Sha512);

    const clientFirstMessage = auth.getClientFirstMessage();
    const clientNonce = clientFirstMessage.split('r=')[1];
    const serverNonce = `${clientNonce}serverNonce`;
    const serverFirstMessage = `r=${serverNonce},s=${Buffer.from('serversalt').toString('base64')},i=4095`;

    await expect(() => auth.getClientFinalMessage(new ServerFirstMessage(serverFirstMessage))).rejects.toThrow(
      'Requested iterations 4095 is less than the minimum 4096 for sha512'
    );
  });

  it('should throw when server returned s-nonce not starting with c-nonce', async () => {
    const username = 'username';
    const credentials = new ScramCredentials(Buffer.from(username), Buffer.from('password'));
    const auth = await ScramMechanism.next(credentials, Sha512);

    const clientFirstMessage = auth.getClientFirstMessage();
    const clientNonce = clientFirstMessage.split('r=')[1];
    const serverNonce = `serverNonce${clientNonce}`;
    const serverFirstMessage = `r=${serverNonce},s=${Buffer.from('serversalt').toString('base64')},i=4096`;

    await expect(() => auth.getClientFinalMessage(new ServerFirstMessage(serverFirstMessage))).rejects.toThrow(
      'Invalid server nonce: does not start with client nonce'
    );
  });
});
