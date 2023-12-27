import { type StartedKafkaContainer } from '@testcontainers/kafka';
import { spawnSync, type SpawnSyncReturns } from 'child_process';
import { createConnection, type Socket } from 'net';

export class KafkaBrokerUtils {
  constructor(
    private readonly kafkaContainer: StartedKafkaContainer,
    private readonly originalPort: number
  ) {}

  public createTopic(topic: string, partitions = 1, replicationFactor = 1): SpawnSyncReturns<string> {
    const result = spawnSync(
      'docker',
      [
        'exec',
        '-i',
        this.kafkaContainer.getName(),
        '/bin/bash',
        '-c',
        `kafka-topics --create --bootstrap-server localhost:9092 --replication-factor ${replicationFactor} --partitions ${partitions} --topic ${topic}`
      ],
      { encoding: 'utf8' }
    );

    if (result.error || result.status !== 0) {
      throw new Error(`Failed to create topic: ${result.error || result.stderr}`);
    }

    return result;
  }

  public async getConnectedSocket(): Promise<Socket> {
    const socket = createConnection(
      this.kafkaContainer.getMappedPort(this.originalPort),
      this.kafkaContainer.getHost()
    );

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        resolve(socket);
      });

      socket.on('error', (error) => {
        reject(error);
      });
    });
  }
}
