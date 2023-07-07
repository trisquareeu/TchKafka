import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { Int16 } from './int16';

/**
 * Represents a sequence of characters or null. For non-null strings, first the length N is given as an INT16.
 * Then N bytes follow which are the UTF-8 encoding of the character sequence.
 * A null value is encoded with length of -1 and there are no following bytes.
 *
 * NOTE: Even though the protocol specification explicitly mentions the null-value to be indicated
 * by the length of exactly -1, the standard Java client libraries treats any negative length as a
 * null-value indicator.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class NullableString implements Serializable {
  constructor(public readonly value: string | null) {}

  public static deserialize(buffer: ReadBuffer): NullableString {
    const length = Int16.deserialize(buffer);
    if (length.value < 0) {
      return new NullableString(null);
    }

    return new NullableString(buffer.readString(length.value));
  }

  public serialize(buffer: WriteBuffer): void {
    if (this.value === null) {
      new Int16(-1).serialize(buffer);
    } else {
      new Int16(Buffer.byteLength(this.value)).serialize(buffer);
      buffer.writeString(this.value);
    }
  }
}
