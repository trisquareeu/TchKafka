import { connect as tcpConnect, type Socket, type TcpNetConnectOpts, type TcpSocketConnectOpts } from 'net';
import { type SocketFactory } from './socket-factory';

export type TcpSocketFactoryOptions = Omit<TcpSocketConnectOpts, 'host' | 'port'>;

export class TcpSocketFactory implements SocketFactory {
  constructor(private readonly options: TcpSocketFactoryOptions = {}) {}

  public async connect(port: number, host: string, connectionTimeout: number = 5000): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socketOptions: TcpNetConnectOpts = { ...this.options, host, port };
      const socket = tcpConnect(socketOptions);

      const timeout = setTimeout(() => {
        socket.destroy(new Error(`Could not establish connection to ${host}:${port} in ${connectionTimeout}ms.`));
      }, connectionTimeout);

      socket.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      socket.once('ready', () => {
        clearTimeout(timeout);
        socket.removeAllListeners();
        resolve(socket);
      });
    });
  }
}
