import { type Socket } from 'net';

export interface SocketFactory {
  connect(port: number, host: string, connectionTimeout?: number): Promise<Socket>;
}
