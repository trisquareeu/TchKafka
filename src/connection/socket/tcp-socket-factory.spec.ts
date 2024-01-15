import net, { Socket } from 'net';
import { TcpSocketFactory } from './tcp-socket-factory';

describe('tcp client socket factory', () => {
  let socketMock: SocketMock;

  beforeEach(() => {
    socketMock = new SocketMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should pass the connection options', async () => {
    socketMock.connect();

    await new TcpSocketFactory({ hints: 2137 }).connect(8080, 'localhost');

    expect(socketMock.connectSpy).toHaveBeenCalledWith({ host: 'localhost', port: 8080, hints: 2137 });
  });

  it('should resolve promise when connection is established on time', async () => {
    socketMock.connect();

    await expect(new TcpSocketFactory().connect(8080, 'localhost')).resolves.toBe(socketMock.socket);
  });

  it('should reject promise when connection cannot be established in a timely manner', async () => {
    socketMock.connect(10);

    await expect(new TcpSocketFactory().connect(8080, 'localhost', 1)).rejects.toThrow(
      'Could not establish connection to localhost:8080 in 1ms.'
    );
  });

  it('should reject promise when connection failed', async () => {
    socketMock.error(new Error('some error'));

    await expect(new TcpSocketFactory().connect(8080, 'localhost')).rejects.toThrow('some error');
  });
});

class SocketMock {
  private readonly _socket: Socket = new Socket();
  private readonly _connectSpy: jest.SpyInstance = jest.spyOn(net, 'connect').mockReturnValue(this.socket);

  constructor() {}

  public get connectSpy(): jest.SpyInstance {
    return this._connectSpy;
  }

  public get socket(): Socket {
    return this._socket;
  }

  public connect(wait?: number): void {
    this.delay(() => this.socket.emit('ready'), wait);
  }

  public error(error: Error, wait?: number): void {
    this.delay(() => this.socket.emit('error', error), wait);
  }

  private delay(callback: () => void, wait?: number): void {
    if (wait !== undefined) {
      setTimeout(callback, wait);
    } else {
      setImmediate(callback);
    }
  }
}
