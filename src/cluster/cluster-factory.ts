import { type Client } from '../client';
import { InvalidTopicError, TopicAuthorizationFailedError } from '../errors';
import { MetadataRequestBuilder } from '../protocol/requests';
import { type SimpleTopic } from '../protocol/requests/metadata/topic';
import { Cluster, type TopicMetadata, type ConnectionInfo } from './cluster';

// FIXME add SpecificTopic

export class ClusterFactory {
  constructor(private readonly topics: SimpleTopic[] = []) {}

  public addTopic(topic: SimpleTopic): ClusterFactory {
    this.topics.push(topic);

    return this;
  }

  // FIXME: What do we do with the nulls?
  public async fetch(client: Client): Promise<Cluster> {
    const metadataResponse = await client.send(
      new MetadataRequestBuilder(client.sessionBuilder.getClientId(), this.topics, false, false, false)
    );

    const topics: Map<string, TopicMetadata> = new Map();
    const unauthorizedTopics: string[] = [];
    const invalidTopics: string[] = [];
    for (const topic of metadataResponse.topics.value!) {
      switch (topic.errorCode.value) {
        case 0:
          topics.set(
            topic.name.value!,
            topic.partitions.value!.map((partition) => ({
              partitionIndex: partition.partitionIndex.value,
              leaderId: partition.leaderId.value!,
              isrNodes: partition.isrNodes.value!.map((node) => node.value),
              replicaNodes: partition.replicaNodes.value!.map((node) => node.value),
              offlineReplicas:
                'offlineReplicas' in partition ? partition.offlineReplicas.value?.map((node) => node.value) : undefined,
              leaderEpoch: 'leaderEpoch' in partition ? partition.leaderEpoch.value : undefined
            }))
          );
          break;
        case TopicAuthorizationFailedError.errorCode:
          unauthorizedTopics.push(topic.name.value!);
          break;
        case InvalidTopicError.errorCode:
          invalidTopics.push(topic.name.value!);
          break;
        default:
          throw new Error(`Unexpected error code ${topic.errorCode.value}`);
      }
    }

    const brokers = metadataResponse.brokers.value!.reduce<Map<number, ConnectionInfo>>((acc, broker) => {
      acc.set(broker.nodeId.value!, { host: broker.host.value!, port: broker.port.value! });

      return acc;
    }, new Map());

    return new Cluster(
      brokers,
      topics,
      unauthorizedTopics,
      invalidTopics,
      'controllerId' in metadataResponse && metadataResponse.controllerId.value!
        ? metadataResponse.controllerId.value!
        : null,
      client.sessionBuilder
    );
  }
}
