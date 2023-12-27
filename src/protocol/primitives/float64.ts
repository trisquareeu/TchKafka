import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';

/**
 * Represents a double-precision 64-bit format IEEE 754 value.
 * The values are encoded using eight bytes in network byte order (big-endian).
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Float64 implements Serializable {
  constructor(private readonly _value: number) {}

  public get value(): number {
    return this._value;
  }

  public static deserialize(buffer: ReadBuffer): Float64 {
    return new Float64(buffer.readDouble());
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    buffer.writeDouble(this.value);
  }
}
