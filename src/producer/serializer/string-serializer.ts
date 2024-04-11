import { type Serializer } from './serializer';

export class StringSerializer implements Serializer<string> {
  constructor(private readonly encoding: BufferEncoding = 'utf-8') {}

  public async serialize(_topic: string, data: string): Promise<Buffer> {
    return Buffer.from(data, this.encoding);
  }
}
