import { createConnection, type Socket } from 'net';
import { type StartedTestContainer } from 'testcontainers';
import { connect } from 'tls';

export class KafkaContainerUtils {
  constructor(private readonly kafkaContainer: StartedTestContainer) {}

  public async createTopic(topic: string, partitions = 1, replicationFactor = 1): Promise<string> {
    const result = await this.kafkaContainer.exec([
      'kafka-topics',
      '--create',
      '--bootstrap-server',
      'localhost:9092',
      '--replication-factor',
      `${replicationFactor}`,
      '--partitions',
      `${partitions}`,
      '--topic',
      `${topic}`
    ]);

    if (result.exitCode !== 0) {
      throw new Error(`Failed to create topic: ${result.output}`);
    }

    return result.output;
  }

  public async getConnectedSocket(port: number = 9092): Promise<Socket> {
    const socket = createConnection(this.kafkaContainer.getMappedPort(port), this.kafkaContainer.getHost());

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        resolve(socket);
      });

      socket.on('error', (error) => {
        reject(error);
      });
    });
  }

  public async getTlsConnectedSocket(port: number = 9095): Promise<Socket> {
    const socket = connect({
      port: this.kafkaContainer.getMappedPort(port),
      host: this.kafkaContainer.getHost(),
      rejectUnauthorized: false
    });

    return new Promise((resolve) => {
      socket.on('secureConnect', () => {
        resolve(socket);
      });
    });
  }
}
