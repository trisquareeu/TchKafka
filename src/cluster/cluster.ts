/**
 * State of the cluster after sending the metadata request.
 */

import { Client } from '../client';
import { type SessionBuilder } from '../client/session';
import { MetadataRequestBuilder } from '../protocol/requests';

export type ConnectionInfo = {
  host: string;
  port: number;
};

export class Cluster {
  constructor(
    protected readonly brokers: Record<number, ConnectionInfo>,
    protected readonly sessionBuilder: SessionBuilder
  ) {}

  public static empty(sessionBuilder: SessionBuilder): Cluster {
    return new Cluster({}, sessionBuilder);
  }

  public getClient(id: number): Client {
    const broker = this.brokers[id];

    if (!broker) {
      throw new Error(`Broker with id ${id} not found`);
    }

    return new Client(broker.host, broker.port, this.sessionBuilder);
  }
}

type BootstrapClusterConfig = {
  clientId: string | null;
  allowAutoTopicCreation: boolean;
  includeClusterAuthorizedOperations: boolean;
  includeTopicAuthorizedOperations: boolean;
};

export class BootstrapCluster extends Cluster {
  private lastBrokerIndex = 0;

  constructor(
    brokers: ConnectionInfo[],
    sessionBuilder: SessionBuilder,
    private readonly config: BootstrapClusterConfig
  ) {
    if (brokers.length === 0) {
      throw new Error('At least one bootstrap broker must be specified');
    }

    const brokersMap = brokers.reduce<Record<number, ConnectionInfo>>((acc, broker, index) => {
      acc[-index] = broker;

      return acc;
    }, {});

    super(brokersMap, sessionBuilder);
  }

  public getClient(id?: number): Client {
    if (id !== undefined) {
      return super.getClient(id);
    }

    return this.getAnyBroker();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async getTopicMetadata(topic: string) {
    const bootstrapClient = this.getClient();
    const metadata = await bootstrapClient.send(
      new MetadataRequestBuilder(
        this.config.clientId,
        [topic],
        this.config.allowAutoTopicCreation,
        this.config.includeClusterAuthorizedOperations,
        this.config.includeTopicAuthorizedOperations
      )
    );
    const topicMetadata = metadata.topics.value?.find((metadataTopic) => metadataTopic.name.value === topic);
    if (!topicMetadata) {
      throw new Error(`Topic ${topic} not found`);
    }

    return topicMetadata;
  }

  private getAnyBroker(): Client {
    const brokerKeys = Object.keys(this.brokers);
    const broker = this.brokers[Number(brokerKeys[this.lastBrokerIndex]!)]!; // FIXME: I'm ugly

    this.lastBrokerIndex = (this.lastBrokerIndex + 1) % brokerKeys.length;

    return new Client(broker.host, broker.port, this.sessionBuilder);
  }
}
