import { type Authenticator, type SocketFactory } from '../client/session';

export type ProducerRecord<K, V, H extends Record<string, string | string[]>> = {
  topic: string;
  partition?: number;
  headers: H; // FIXME: Narrow the type;
  key: K;
  value: V;
  timestamp?: number;
};

export type RecordMetadata = {
  offset: bigint;
  timestamp: bigint;
  serializedKeySize: number;
  serializedValueSize: number;
  topic: string;
  partition: number;
};

export type ProducerConfig = {
  clientOptions?: {
    connectionTimeout: number;
    clientId: string;
  };
  auth?: {
    authenticator: Authenticator;
    socketFactory: SocketFactory;
  };
  acks: -1 | 0 | 1;
};

export interface Producer<K, V> {
  send<H extends Record<string, string | string[]>>(
    record: ProducerRecord<K, V, H>
  ): Promise<RecordMetadata | undefined>;
}
