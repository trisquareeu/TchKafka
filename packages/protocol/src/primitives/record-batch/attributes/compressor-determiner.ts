import { CompressionType, type CompressionTypeValue } from './compression-type';
import {
  type Compressor,
  GzipCompressor,
  Lz4Compressor,
  NoopCompressor,
  SnappyCompressor,
  ZstdCompressor
} from '../../../compression';

export class CompressorDeterminer {
  private static CompressorMap = {
    [CompressionType.None]: new NoopCompressor(),
    [CompressionType.GZIP]: new GzipCompressor(),
    [CompressionType.Snappy]: new SnappyCompressor(),
    [CompressionType.LZ4]: new Lz4Compressor(),
    [CompressionType.ZSTD]: new ZstdCompressor()
  };

  public static fromValue(type: CompressionTypeValue): Compressor {
    return CompressorDeterminer.CompressorMap[type];
  }
}
