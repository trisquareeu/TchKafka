import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';

/**
 * Represents a boolean value in a byte. Values 0 and 1 are used to represent false and true respectively.
 * When reading a boolean value, any non-zero value is considered true.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Boolean implements Serializable {
  constructor(private readonly _value: boolean) {}

  public get value(): boolean {
    return this._value;
  }

  public static deserialize(buffer: ReadBuffer): Boolean {
    return new Boolean(buffer.readUInt8() !== 0);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    buffer.writeUInt8(this.value ? 1 : 0);
  }
}
