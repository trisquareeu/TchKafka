import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int16 } from './int16';
import { String } from './string';
import { NullInNonNullableFieldError } from '../exceptions';

describe('String', () => {
  const cases = [
    { value: '', buffer: Buffer.from([0x00, 0x00]) },
    { value: 'Hello!', buffer: Buffer.from([0x00, 0x06, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21]) },
    { value: '¤¤¤', buffer: Buffer.from([0x00, 0x06, 0xc2, 0xa4, 0xc2, 0xa4, 0xc2, 0xa4]) }
  ];

  it.each(cases)('should correctly serialize to byte array', ({ value, buffer }) => {
    const writeBuffer = new WriteBuffer();
    new String(value).serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('should correctly deserialize from byte array', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    expect(String.deserialize(readBuffer).value).toEqual(value);
  });

  it('should throw if String length is greater than Int16.MAX_VALUE', () => {
    const string = new String('a'.repeat(Int16.MAX_VALUE + 1));

    const writeBuffer = new WriteBuffer();
    expect(() => string.serialize(writeBuffer)).toThrow();
  });

  it('should throw when attempted to deserialize illegal length', () => {
    const readBuffer = new ReadBuffer(Buffer.from([0xff, 0xff]));
    expect(() => String.deserialize(readBuffer)).toThrow(NullInNonNullableFieldError);
  });
});
