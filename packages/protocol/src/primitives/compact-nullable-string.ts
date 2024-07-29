import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { CompactNullableBytes } from './compact-nullable-bytes';

/**
 * Represents a sequence of characters. First the length N + 1 is given as an UNSIGNED_VARINT.
 * Then N bytes follow which are the UTF-8 encoding of the character sequence.
 * A null string is represented with a length of 0.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class CompactNullableString implements Serializable {
  constructor(private readonly _value: string | null) {}

  public get value(): string | null {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<CompactNullableString> {
    const compactNullableBytes = await CompactNullableBytes.deserialize(buffer);
    if (compactNullableBytes.value === null) {
      return new CompactNullableString(null);
    }

    return new CompactNullableString(compactNullableBytes.value.toString('utf-8'));
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    const nullableBuffer = this.value === null ? null : Buffer.from(this.value, 'utf-8');
    await new CompactNullableBytes(nullableBuffer).serialize(buffer);
  }
}
