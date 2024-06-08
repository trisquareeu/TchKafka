import { type Compressor } from '../compressor';

export class NoopCompressor implements Compressor {
  public async compress(buffer: Buffer): Promise<Buffer> {
    return buffer;
  }

  public async decompress(buffer: Buffer): Promise<Buffer> {
    return buffer;
  }
}
