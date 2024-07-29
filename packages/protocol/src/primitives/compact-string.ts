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
  constructor(value: string) {
    super(value);
  }

  public override get value(): string {
    return super.value as string;
  }

  public static override async deserialize(buffer: ReadBuffer): Promise<CompactString> {
    const compactNullableString = await super.deserialize(buffer);
    if (compactNullableString.value === null) {
      throw new NullInNonNullableFieldError('CompactString cannot be null');
    }

    return new CompactString(compactNullableString.value);
  }
}
