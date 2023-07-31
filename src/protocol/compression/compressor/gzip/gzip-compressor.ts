import { gzip, unzip } from 'zlib';
import { type Compressor } from '../compressor';

export class GzipCompressor implements Compressor {
  public async compress(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      gzip(buffer, (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public async decompress(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      unzip(buffer, (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }
}
