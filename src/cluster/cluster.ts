/**
 * State of the cluster after sendAndExpectResponseing the metadata request.
 */

import { Client } from '../client';
import { type SessionBuilder } from '../client/session';

export type ConnectionInfo = {
  host: string;
  port: number;
};

export type TopicMetadata = Record<
  number,
  {
    readonly leaderId: number;
    readonly leaderEpoch?: number;
    readonly replicaNodes: number[];
    readonly isrNodes: number[];
    readonly offlineReplicas?: number[];
  }
>;

/**
 * An immutable representation of a subset of the nodes, topics, and partitions in the Kafka cluster.
 */
export class Cluster {
  constructor(
    protected readonly brokers: Map<number, ConnectionInfo>,
    protected readonly topics: Map<string, TopicMetadata>,
    protected readonly unauthorizedTopics: string[],
    protected readonly invalidTopics: string[],
    protected readonly controllerId: number | null,
    protected readonly sessionBuilder: SessionBuilder
  ) {}

  public static empty(sessionBuilder: SessionBuilder): Cluster {
    return new Cluster(new Map(), new Map(), [], [], null, sessionBuilder);
  }

  public merge(cluster: Cluster): Cluster {
    return new Cluster(
      { ...this.brokers, ...cluster.brokers },
      { ...this.topics, ...cluster.topics },
      [...this.unauthorizedTopics, ...cluster.unauthorizedTopics],
      [...this.invalidTopics, ...cluster.invalidTopics],
      cluster.controllerId ?? this.controllerId,
      this.sessionBuilder
    );
  }

  public isTopicInvalid(topic: string): boolean {
    return this.invalidTopics.includes(topic);
  }

  public getTopicMetadata(topic: string): TopicMetadata | undefined {
    return this.topics.get(topic);
  }

  public getClient(id: number): Client {
    const broker = this.brokers.get(id);

    if (!broker) {
      throw new Error(`Broker with id ${id} not found`);
    }

    return new Client(broker.host, broker.port, this.sessionBuilder);
  }
}

export class BootstrapCluster extends Cluster {
  private lastBrokerIndex = 0;

  constructor(brokers: ConnectionInfo[], sessionBuilder: SessionBuilder) {
    if (brokers.length === 0) {
      throw new Error('At least one bootstrap broker must be specified');
    }

    const brokersMap = new Map<number, ConnectionInfo>();
    brokers.forEach((broker, index) => {
      brokersMap.set(-index, broker);
    });

    super(brokersMap, new Map(), [], [], null, sessionBuilder);
  }

  public getClient(id?: number): Client {
    if (id !== undefined) {
      return super.getClient(id);
    }

    return this.getAnyBroker();
  }

  private getAnyBroker(): Client {
    const broker = this.brokers.get(-this.lastBrokerIndex);
    if (!broker) {
      throw new Error('No brokers available'); // FIXME: Add better message
    }

    this.lastBrokerIndex = (this.lastBrokerIndex + 1) % this.brokers.size;

    return new Client(broker.host, broker.port, this.sessionBuilder);
  }
}
