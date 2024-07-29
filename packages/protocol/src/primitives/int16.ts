import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange } from './utils';

/**
 * Represents an integer between -2^15 and 2^15-1 inclusive.
 * The values are encoded using two bytes in network byte order (big-endian).
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Int16 implements Serializable {
  public static readonly MAX_VALUE = 32767;
  public static readonly MIN_VALUE = -32768;

  constructor(private readonly _value: number) {
    checkValueIsInRange(_value, Int16.MIN_VALUE, Int16.MAX_VALUE);
  }

  public get value(): number {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<Int16> {
    return new Int16(buffer.readInt16());
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    buffer.writeInt16(this.value);
  }
}
