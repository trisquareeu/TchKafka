import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int32 } from './int32';

describe('Int32', () => {
  const cases = [
    { value: 0, buffer: Buffer.from([0x00, 0x00, 0x00, 0x00]) },
    { value: 1, buffer: Buffer.from([0x00, 0x00, 0x00, 0x01]) },
    { value: -1, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff]) },
    { value: 127, buffer: Buffer.from([0x00, 0x00, 0x00, 0x7f]) },
    { value: -128, buffer: Buffer.from([0xff, 0xff, 0xff, 0x80]) },
    { value: 32767, buffer: Buffer.from([0x00, 0x00, 0x7f, 0xff]) },
    { value: -32768, buffer: Buffer.from([0xff, 0xff, 0x80, 0x00]) },
    { value: 2147483647, buffer: Buffer.from([0x7f, 0xff, 0xff, 0xff]) },
    { value: -2147483648, buffer: Buffer.from([0x80, 0x00, 0x00, 0x00]) }
  ];

  it.each(cases)('value stored in the Int32 should be correctly serialized', ({ value, buffer }) => {
    const int32 = new Int32(value);
    const writeBuffer = new WriteBuffer();
    int32.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('byte array should be correctly deserialized to Int32', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const int32 = Int32.deserialize(readBuffer);
    expect(int32.value).toEqual(value);
  });

  const serializeAndDeserializeCases = [-2147483648, -1, 0, 1, 2147483647];

  it.each(serializeAndDeserializeCases)('int32 should serialize and deserialize into the same value', (value) => {
    const int32 = new Int32(value);
    const writeBuffer = new WriteBuffer();
    int32.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
    const deserializedInt32 = Int32.deserialize(readBuffer);
    expect(deserializedInt32.value).toEqual(value);
  });

  it.each([-2147483649, 2147483648])('should not accept values exceeding allowed range', (value) => {
    expect(() => new Int32(value)).toThrow();
  });
});
