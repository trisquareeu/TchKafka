import { type Serializer } from './serializer';

export class StringSerializer implements Serializer<string> {
  public async serialize(_topic: string, data: string): Promise<Buffer> {
    return Buffer.from(data);
  }
}
