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

  constructor(private readonly _value: Buffer) {
    if (_value.length !== Uuid.NUMBER_OF_BYTES) {
      throw new IllegalArgumentError('UUID must have exactly 16 bytes.');
    }
  }

  public get value(): Buffer {
    return this._value;
  }

  public static deserialize(buffer: ReadBuffer): Uuid {
    return new Uuid(buffer.readBuffer(Uuid.NUMBER_OF_BYTES));
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    buffer.writeBuffer(this.value);
  }
}
