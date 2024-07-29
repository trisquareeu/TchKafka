import { NullInNonNullableFieldError } from '../exceptions';
import { type ReadBuffer } from '../serialization';
import { Array, type ArraySerializer, type ArrayDeserializer } from './array';

export class NonNullableArray<T> extends Array<T> {
  constructor(value: readonly T[], serializer: ArraySerializer<T> | null = null) {
    super(value, serializer);
  }

  public override get value(): readonly T[] {
    return super.value!;
  }

  public static override async deserialize<T>(
    buffer: ReadBuffer,
    deserializer: ArrayDeserializer<T>
  ): Promise<NonNullableArray<T>> {
    const array = await super.deserialize(buffer, deserializer);
    if (array.value === null) {
      throw new NullInNonNullableFieldError('Expected non-nullable array');
    }

    return new NonNullableArray(array.value);
  }

  public static override async deserializeEntries<T>(
    buffer: ReadBuffer,
    length: number,
    deserializer: ArrayDeserializer<T>
  ): Promise<NonNullableArray<T>> {
    const array = await super.deserializeEntries(buffer, length, deserializer);
    if (array.value === null) {
      throw new NullInNonNullableFieldError('Expected non-nullable array');
    }

    return new NonNullableArray(array.value);
  }
}
