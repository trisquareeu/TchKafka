import { isIP, type Socket } from 'net';
import { connect as tlsConnect, type ConnectionOptions } from 'tls';
import { type SocketFactory } from './socket-factory';

export type TlsSocketFactoryOptions = Omit<ConnectionOptions, 'host' | 'port' | 'servername'>;

export class TlsSocketFactory implements SocketFactory {
  constructor(private readonly options: TlsSocketFactoryOptions = {}) {}

  public async connect(port: number, host: string, connectionTimeout = 60000): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socketOptions: ConnectionOptions = { ...this.options, host, port };
      if (!isIP(host)) {
        socketOptions.servername = host;
      }
      const socket = tlsConnect(socketOptions);

      const timeout = setTimeout(() => {
        socket.destroy(
          new Error(`Could not establish secure connection to ${host}:${port} in ${connectionTimeout}ms.`)
        );
      }, connectionTimeout);

      socket.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      socket.once('secureConnect', () => {
        clearTimeout(timeout);
        socket.removeAllListeners();
        resolve(socket);
      });
    });
  }
}
