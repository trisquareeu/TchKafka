import { decode, encode } from 'lz4';
import { type Compressor } from '../compressor';

export class Lz4Compressor implements Compressor {
  public async compress(buffer: Buffer): Promise<Buffer> {
    return encode(buffer);
  }

  public async decompress(buffer: Buffer): Promise<Buffer> {
    return decode(buffer);
  }
}
