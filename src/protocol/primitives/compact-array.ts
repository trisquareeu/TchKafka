import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { type ArrayDeserializer } from './array';
import { UVarInt } from './uvarint';

/**
 * Represents a sequence of objects of a given type T. Type T can be either a primitive type (e.g. STRING) or a structure.
 * First, the length N + 1 is given as an UNSIGNED_VARINT. Then N instances of type T follow.
 * A null array is represented with a length of 0. In protocol documentation an array of T instances is referred to as [T].
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class CompactArray<T extends Serializable> implements Serializable {
  constructor(public readonly value: T[] | null) {}

  public static deserialize<T extends Serializable>(
    buffer: ReadBuffer,
    deserialize: ArrayDeserializer<T>
  ): CompactArray<T> {
    const length = UVarInt.deserialize(buffer);
    if (length.value === 0) {
      return new CompactArray(null);
    }

    const value: T[] = [];
    for (let i = 0; i < length.value - 1; i++) {
      value.push(deserialize(buffer));
    }

    return new CompactArray(value);
  }

  public serialize(buffer: WriteBuffer): void {
    if (this.value === null) {
      new UVarInt(0).serialize(buffer);
    } else {
      new UVarInt(this.value.length + 1).serialize(buffer);
      for (const item of this.value) {
        item.serialize(buffer);
      }
    }
  }
}
