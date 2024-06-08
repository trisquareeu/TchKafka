import { compress, decompress } from '@mongodb-js/zstd';
import { type Compressor } from '../compressor';

export class ZstdCompressor implements Compressor {
  public async compress(buffer: Buffer): Promise<Buffer> {
    return compress(buffer);
  }

  public async decompress(buffer: Buffer): Promise<Buffer> {
    return decompress(buffer);
  }
}
