import { ReadBuffer, WriteBuffer } from '../serialization';
import { Bytes } from './bytes';
import { NullInNonNullableFieldError } from '../exceptions';
import { Int32 } from './int32';

describe('Bytes', () => {
  const cases = [
    { value: Buffer.from([]), buffer: Buffer.from([0x00, 0x00, 0x00, 0x00]) },
    { value: Buffer.from([0x41, 0x42, 0x43]), buffer: Buffer.from([0x00, 0x00, 0x00, 0x03, 0x41, 0x42, 0x43]) },
    {
      value: Buffer.from([0xff, 0x41, 0x42, 0x43, 0xff]),
      buffer: Buffer.from([0x00, 0x00, 0x00, 0x05, 0xff, 0x41, 0x42, 0x43, 0xff])
    }
  ];

  it.each(cases)('should correctly serialize to byte array', ({ value, buffer }) => {
    const writeBuffer = new WriteBuffer();
    new Bytes(value).serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('should correctly deserialize from byte array', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    expect(Bytes.deserialize(readBuffer).value).toEqual(value);
  });

  it('should throw if Bytes length is greater than Int16.MAX_VALUE', () => {
    const bytes = new Bytes(Buffer.allocUnsafe(Int32.MAX_VALUE + 1).fill(0xff));
    const writeBuffer = new WriteBuffer();
    expect(() => bytes.serialize(writeBuffer)).toThrow();
  });

  it('should throw when attempted to deserialize illegal length', () => {
    const readBuffer = new ReadBuffer(Buffer.from([0xff, 0xff, 0xff, 0xff]));
    expect(() => Bytes.deserialize(readBuffer)).toThrow(NullInNonNullableFieldError);
  });
});
