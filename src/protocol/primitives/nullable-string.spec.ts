import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int16 } from './int16';
import { NullableString } from './nullable-string';

describe('nullable string', () => {
  const cases = [
    { value: null },
    { value: '' },
    { value: 'a' },
    { value: 'hello world' },
    { value: 'a'.repeat(256) },
    { value: 'a'.repeat(Int16.MAX_VALUE) },
    { value: '¤¤¤' }
  ];

  it.each(cases)('serialize and deserialize into the same value', ({ value }) => {
    const string = new NullableString(value);
    const writeBuffer = new WriteBuffer();
    string.serialize(writeBuffer);

    const buffer = writeBuffer.toBuffer();
    const readBuffer = new ReadBuffer(buffer);
    const deserializedString = NullableString.deserialize(readBuffer);
    expect(deserializedString.value).toEqual(string.value);
  });

  it('should throw if String length is greater than Int16.MAX_VALUE', () => {
    const string = new NullableString('a'.repeat(Int16.MAX_VALUE + 1));
    const writeBuffer = new WriteBuffer();
    expect(() => string.serialize(writeBuffer)).toThrow();
  });

  it('should correctly serialize and deserialize null values', () => {
    const nullValue = Buffer.from([0xff, 0xff]);
    const deserialized = NullableString.deserialize(new ReadBuffer(nullValue));
    expect(deserialized.value).toBeNull();

    const serialized = new WriteBuffer();
    new NullableString(null).serialize(serialized);
    expect(serialized.toBuffer()).toEqual(nullValue);
  });
});
