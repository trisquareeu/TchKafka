export interface Serializer<T> {
  serialize(topic: string, data: T): Promise<Buffer>;
}
