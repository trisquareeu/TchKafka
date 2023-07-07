import { NullInNonNullableFieldError } from '../exceptions';
import type { ReadBuffer, Serializable } from '../serialization';
import { CompactNullableString } from './compact-nullable-string';

/**
 * Represents a sequence of characters.
 * First the length N + 1 is given as an UNSIGNED_VARINT.
 * Then N bytes follow which are the UTF-8 encoding of the character sequence.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class CompactString extends CompactNullableString implements Serializable {
  constructor(public readonly value: string) {
    super(value);
  }

  public static deserialize(buffer: ReadBuffer): CompactString {
    const compactNullableString = super.deserialize(buffer);
    if (compactNullableString.value === null) {
      throw new NullInNonNullableFieldError('CompactString cannot be null');
    }

    return new CompactString(compactNullableString.value);
  }
}
