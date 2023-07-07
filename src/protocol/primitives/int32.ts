import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange } from './utils';

/**
 * Represents an integer between -2^31 and 2^31-1 inclusive.
 * The values are encoded using four bytes in network byte order (big-endian).
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Int32 implements Serializable {
  public static readonly MAX_VALUE = 2147483647;
  public static readonly MIN_VALUE = -2147483648;

  constructor(public readonly value: number) {
    checkValueIsInRange(value, Int32.MIN_VALUE, Int32.MAX_VALUE);
  }

  public static deserialize(buffer: ReadBuffer): Int32 {
    return new Int32(buffer.readInt32());
  }

  public serialize(buffer: WriteBuffer): void {
    buffer.writeInt32(this.value);
  }
}
