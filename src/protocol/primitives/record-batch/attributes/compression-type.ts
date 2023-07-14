import { IllegalArgumentError } from '../../../exceptions';
import type { Int16 } from '../../int16';

/**
 * bit 0~2:
 *         0: no compression
 *         1: gzip
 *         2: snappy
 *         3: lz4
 *         4: zstd
 *
 * @see https://kafka.apache.org/documentation/#messageformat
 */
export class CompressionType {
  public static readonly None = 0b00000000;
  public static readonly GZIP = 0b00000001;
  public static readonly Snappy = 0b00000010;
  public static readonly LZ4 = 0b00000011;
  public static readonly ZSTD = 0b00000100;
  private static readonly MASK = 0b00000000_00000111;

  public static fromInt16({ value }: Int16): CompressionTypeValue {
    const compression = value & this.MASK;
    if (compression > 4) {
      throw new IllegalArgumentError(`Expected compression value to be in range 0-4, received ${value}`);
    }

    return compression as CompressionTypeValue;
  }
}

export type CompressionTypeValue =
  | typeof CompressionType.None
  | typeof CompressionType.GZIP
  | typeof CompressionType.Snappy
  | typeof CompressionType.LZ4
  | typeof CompressionType.ZSTD;
