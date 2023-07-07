import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { Int32 } from './int32';

/**
 * Represents a raw sequence of bytes or null.
 * For non-null values, first the length N is given as an INT32. Then N bytes follow.
 * A null value is encoded with length of -1 and there are no following bytes.
 *
 * NOTE: Even though the protocol specification explicitly mentions the null-value to be indicated
 * by the length of exactly -1, the standard Java client libraries treats any negative length as a
 * null-value indicator.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class NullableBytes implements Serializable {
  constructor(public readonly value: Buffer | null) {}

  public static deserialize(buffer: ReadBuffer): NullableBytes {
    const length = Int32.deserialize(buffer);
    if (length.value < 0) {
      return new NullableBytes(null);
    }

    return new NullableBytes(buffer.readBuffer(length.value));
  }

  public serialize(buffer: WriteBuffer): void {
    if (this.value === null) {
      new Int32(-1).serialize(buffer);
    } else {
      new Int32(this.value.length).serialize(buffer);
      buffer.writeBuffer(this.value);
    }
  }
}
