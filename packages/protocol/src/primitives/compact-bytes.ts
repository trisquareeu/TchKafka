import { NullInNonNullableFieldError } from '../exceptions';
import type { ReadBuffer, Serializable } from '../serialization';
import { CompactNullableBytes } from './compact-nullable-bytes';

/**
 * Represents a raw sequence of bytes.
 * First the length N+1 is given as an UNSIGNED_VARINT. Then N bytes follow.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class CompactBytes extends CompactNullableBytes implements Serializable {
  constructor(value: Buffer) {
    super(value);
  }

  public override get value(): Buffer {
    return super.value as Buffer;
  }

  public static override async deserialize(buffer: ReadBuffer): Promise<CompactBytes> {
    const compactNullableBytes = await super.deserialize(buffer);
    if (compactNullableBytes.value === null) {
      throw new NullInNonNullableFieldError('CompactBytes cannot be null');
    }

    return new CompactBytes(compactNullableBytes.value);
  }
}
