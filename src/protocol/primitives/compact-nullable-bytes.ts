import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { UVarInt } from './uvarint';

/**
 * Represents a raw sequence of bytes.
 * First the length N+1 is given as an UNSIGNED_VARINT. Then N bytes follow.
 * A null object is represented with a length of 0.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class CompactNullableBytes implements Serializable {
  constructor(private readonly _value: Buffer | null) {}

  public get value(): Buffer | null {
    return this._value;
  }

  public static deserialize(buffer: ReadBuffer): CompactNullableBytes {
    const length = UVarInt.deserialize(buffer);
    if (length.value === 0) {
      return new CompactNullableBytes(null);
    }

    return new CompactNullableBytes(buffer.readBuffer(length.value - 1));
  }

  public serialize(buffer: WriteBuffer): void {
    if (this.value === null) {
      new UVarInt(0).serialize(buffer);
    } else {
      new UVarInt(this.value.length + 1).serialize(buffer);
      buffer.writeBuffer(this.value);
    }
  }
}
