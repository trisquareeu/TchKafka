import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange } from './utils';

/**
 * Represents an integer between -2^7 and 2^7-1 inclusive.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Int8 implements Serializable {
  public static readonly MAX_VALUE = 127;
  public static readonly MIN_VALUE = -128;

  constructor(private readonly _value: number) {
    checkValueIsInRange(_value, Int8.MIN_VALUE, Int8.MAX_VALUE);
  }

  public get value(): number {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<Int8> {
    return new Int8(buffer.readInt8());
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    buffer.writeInt8(this.value);
  }
}
