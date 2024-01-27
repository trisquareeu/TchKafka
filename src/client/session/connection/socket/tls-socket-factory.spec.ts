import { Socket } from 'net';
import tls, { TLSSocket } from 'tls';
import { TlsSocketFactory } from './tls-socket-factory';

describe('TlsSocketFactory', () => {
  let socketMock: SocketMock;

  beforeEach(() => {
    socketMock = new SocketMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should pass the connection options', async () => {
    socketMock.secureConnect();

    await new TlsSocketFactory({ minVersion: 'TLSv1.3' }).connect(8080, 'localhost');

    expect(socketMock.connectSpy).toHaveBeenCalledWith({
      port: 8080,
      host: 'localhost',
      servername: 'localhost',
      minVersion: 'TLSv1.3'
    });
  });

  it('should pass the connection options and not not include the servername when the host is an IPv4 address', async () => {
    socketMock.secureConnect();

    await new TlsSocketFactory({ minVersion: 'TLSv1.3' }).connect(8080, '127.0.0.1');

    expect(socketMock.connectSpy).toHaveBeenCalledWith({
      port: 8080,
      host: '127.0.0.1',
      minVersion: 'TLSv1.3'
    });
  });

  it('should pass the connection options and not not include the servername when the host is an IPv6 address', async () => {
    socketMock.secureConnect();

    await new TlsSocketFactory({ minVersion: 'TLSv1.3' }).connect(8080, '::1');

    expect(socketMock.connectSpy).toHaveBeenCalledWith({
      port: 8080,
      host: '::1',
      minVersion: 'TLSv1.3'
    });
  });

  it('should resolve the promise when the connection is established on time', async () => {
    socketMock.secureConnect();

    await expect(new TlsSocketFactory().connect(8080, 'localhost')).resolves.toBe(socketMock.tlsSocket);
  });

  it('should reject promise when connection cannot be established in a timely manner', async () => {
    socketMock.secureConnect(10);

    await expect(new TlsSocketFactory().connect(8080, 'localhost', 1)).rejects.toThrow(
      'Could not establish secure connection to localhost:8080 in 1ms.'
    );
  });

  it('should reject promise when connection failed', async () => {
    socketMock.error(new Error('some error'));

    await expect(new TlsSocketFactory().connect(8080, 'localhost')).rejects.toThrow('some error');
  });
});

class SocketMock {
  private readonly _socket: Socket = new Socket();
  private readonly _tlsSocket: TLSSocket = new TLSSocket(this.socket);
  private readonly _connectSpy: jest.SpyInstance = jest.spyOn(tls, 'connect').mockReturnValue(this.tlsSocket);

  constructor() {}

  public get connectSpy(): jest.SpyInstance {
    return this._connectSpy;
  }

  public get socket(): Socket {
    return this._socket;
  }

  public get tlsSocket(): TLSSocket {
    return this._tlsSocket;
  }

  public secureConnect(wait?: number): void {
    this.delay(() => this.tlsSocket.emit('secureConnect'), wait);
  }

  public error(error: Error, wait?: number): void {
    this.delay(() => this.tlsSocket.emit('error', error), wait);
  }

  private delay(callback: () => void, wait?: number): void {
    if (wait !== undefined) {
      setTimeout(callback, wait);
    } else {
      setImmediate(callback);
    }
  }
}
