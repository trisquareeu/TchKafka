import { type Deserializer, type ReadBuffer } from '../serialization';

/**
 * The undocumented nullable primitive type.
 */
export class Nullable<T> {
  constructor(private readonly _value: T | null) {}

  public get value(): T | null {
    return this._value;
  }

  public static deserialize<T>(buffer: ReadBuffer, deserialize: Deserializer<T>): Nullable<T> {
    const isNull = buffer.readInt8() < 0;

    return new Nullable(isNull ? null : deserialize(buffer));
  }
}
