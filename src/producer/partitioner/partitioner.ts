export interface Partitioner<K, V> {
  partition(topic: string, key: K, keyBytes: Buffer, value: V, valueBytes: Buffer, partitions: number): number;
}
