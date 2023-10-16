import { NullInNonNullableFieldError } from '../exceptions';
import { type ReadBuffer } from '../serialization';
import { Array, type ArraySerializer, type ArrayDeserializer } from './array';

export class NonNullableArray<T> extends Array<T> {
  constructor(value: readonly T[], serializer: ArraySerializer<T> | null = null) {
    super(value, serializer);
  }

  public get value(): readonly T[] {
    return super.value!;
  }

  public static deserialize<T>(buffer: ReadBuffer, deserializer: ArrayDeserializer<T>): NonNullableArray<T> {
    const array = super.deserialize(buffer, deserializer);
    if (array.value === null) {
      throw new NullInNonNullableFieldError('Expected non-nullable array');
    }

    return new NonNullableArray(array.value);
  }

  public static deserializeEntries<T>(
    buffer: ReadBuffer,
    length: number,
    deserializer: ArrayDeserializer<T>
  ): NonNullableArray<T> {
    const array = super.deserializeEntries(buffer, length, deserializer);
    if (array.value === null) {
      throw new NullInNonNullableFieldError('Expected non-nullable array');
    }

    return new NonNullableArray(array.value);
  }
}
