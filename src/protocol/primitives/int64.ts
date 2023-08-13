import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange } from './utils';

/**
 * Represents an integer between -2^63 and 2^63-1 inclusive.
 * The values are encoded using eight bytes in network byte order (big-endian).
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Int64 implements Serializable {
  public static readonly MAX_VALUE = BigInt('9223372036854775807');
  public static readonly MIN_VALUE = BigInt('-9223372036854775808');

  constructor(private readonly _value: bigint) {
    checkValueIsInRange(_value, Int64.MIN_VALUE, Int64.MAX_VALUE);
  }

  public get value(): bigint {
    return this._value;
  }

  public static deserialize(buffer: ReadBuffer): Int64 {
    return new Int64(buffer.readInt64());
  }

  public serialize(buffer: WriteBuffer): void {
    buffer.writeInt64(this.value);
  }
}
