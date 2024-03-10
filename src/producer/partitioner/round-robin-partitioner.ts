import { type Partitioner } from './partitioner';

export class RoundRobinPartitioner<K, V> implements Partitioner<K, V> {
  private readonly topicCounterMap: Record<string, number> = {};

  public partition(
    topic: string,
    _key: K,
    _keyBytes: Buffer,
    _value: V,
    _valueBytes: Buffer,
    partitions: number
  ): number {
    const counter = this.topicCounterMap[topic] || 0;
    this.topicCounterMap[topic] = (counter + 1) % partitions;

    return counter;
  }
}
