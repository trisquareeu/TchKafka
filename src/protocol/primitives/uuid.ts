import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { IllegalArgumentError } from '../exceptions';

/**
 * Represents a type 4 immutable universally unique identifier (Uuid).
 * The values are encoded using sixteen bytes in network byte order (big-endian).
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class Uuid implements Serializable {
  private static readonly NUMBER_OF_BYTES = 16;

  constructor(public readonly value: Buffer) {
    if (value.length !== Uuid.NUMBER_OF_BYTES) {
      throw new IllegalArgumentError('UUID must have exactly 16 bytes.');
    }
  }

  public static deserialize(buffer: ReadBuffer): Uuid {
    return new Uuid(buffer.readBuffer(Uuid.NUMBER_OF_BYTES));
  }

  public serialize(buffer: WriteBuffer): void {
    buffer.writeBuffer(this.value);
  }
}
