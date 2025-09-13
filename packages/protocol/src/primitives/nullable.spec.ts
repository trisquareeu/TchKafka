import { type ReadBuffer } from '../serialization';
import { Nullable } from './nullable';

describe('Nullable', () => {
  it('should store and return the correct value via .value getter', () => {
    const nullableWithValue = new Nullable(123);
    expect(nullableWithValue.value).toBe(123);

    const nullableWithNull = new Nullable<number>(null);
    expect(nullableWithNull.value).toBeNull();
  });

  it('should deserialize to Nullable with null when marker is negative', () => {
    const buffer = {
      readInt8: jest.fn().mockReturnValue(-1)
    } as unknown as ReadBuffer;
    const deserializer = jest.fn();

    const result = Nullable.deserialize(buffer, deserializer);

    expect(result.value).toBeNull();
    expect(deserializer).not.toHaveBeenCalled();
  });

  it('should deserialize to Nullable with value when marker is non-negative', () => {
    const buffer = {
      readInt8: jest.fn().mockReturnValue(0)
    } as unknown as ReadBuffer;
    const deserializer = jest.fn().mockReturnValue('foo');

    const result = Nullable.deserialize(buffer, deserializer);

    expect(result.value).toBe('foo');
    expect(deserializer).toHaveBeenCalledWith(buffer);
  });
});
