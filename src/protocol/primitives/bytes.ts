import { NullInNonNullableFieldError } from '../exceptions';
import type { ReadBuffer, Serializable } from '../serialization';
import { NullableBytes } from './nullable-bytes';

/**
 * Represents a raw sequence of bytes. First the length N is given as an INT32.
 * Then N bytes follow.
 *
 * NOTE: Even though the official documentation does not state that explicitly,
 * the null values are not permitted in this type.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Bytes extends NullableBytes implements Serializable {
  constructor(public readonly value: Buffer) {
    super(value);
  }

  public static deserialize(buffer: ReadBuffer): Bytes {
    const nullableBytes = super.deserialize(buffer);
    if (nullableBytes.value === null) {
      throw new NullInNonNullableFieldError('Bytes cannot be null');
    }

    return new Bytes(nullableBytes.value);
  }
}
