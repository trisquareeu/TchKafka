import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange } from './utils';

/**
 * Represents an integer between 0 and 2^32-1 inclusive.
 * The values are encoded using four bytes in network byte order (big-endian).
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class UInt32 implements Serializable {
  public static readonly MAX_VALUE = 4294967295;
  public static readonly MIN_VALUE = 0;

  constructor(public readonly value: number) {
    checkValueIsInRange(value, UInt32.MIN_VALUE, UInt32.MAX_VALUE);
  }

  public static deserialize(buffer: ReadBuffer): UInt32 {
    return new UInt32(buffer.readUInt32());
  }

  public serialize(buffer: WriteBuffer): void {
    buffer.writeUInt32(this.value);
  }
}
