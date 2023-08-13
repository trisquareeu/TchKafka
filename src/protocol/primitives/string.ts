import { NullInNonNullableFieldError } from '../exceptions';
import type { ReadBuffer, Serializable } from '../serialization';
import { NullableString } from './nullable-string';

/**
 * Represents a sequence of characters.
 * First the length N is given as an INT16.
 * Then N bytes follow which are the UTF-8 encoding of the character sequence.
 * Length must not be negative.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class String extends NullableString implements Serializable {
  constructor(value: string) {
    super(value);
  }

  public get value(): string {
    return super.value as string;
  }

  public static deserialize(buffer: ReadBuffer): String {
    const nullableString = super.deserialize(buffer);
    if (nullableString.value === null) {
      throw new NullInNonNullableFieldError('String cannot be null');
    }

    return new String(nullableString.value);
  }
}
