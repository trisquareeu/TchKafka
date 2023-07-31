export interface Compressor {
  compress(buffer: Buffer): Promise<Buffer>;
  decompress(buffer: Buffer): Promise<Buffer>;
}
