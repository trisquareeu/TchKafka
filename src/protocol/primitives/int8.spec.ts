import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int8 } from './int8';

describe('Int8', () => {
  const cases = [
    { value: 0, buffer: Buffer.from([0x00]) },
    { value: 1, buffer: Buffer.from([0x01]) },
    { value: -1, buffer: Buffer.from([0xff]) },
    { value: 127, buffer: Buffer.from([0x7f]) },
    { value: -128, buffer: Buffer.from([0x80]) }
  ];

  it.each(cases)('Value stored in the Int8 should be correctly serialized', async ({ value, buffer }) => {
    const int8 = new Int8(value);
    const writeBuffer = new WriteBuffer();
    await int8.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('Byte array should be correctly deserialized to Int8', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const int8 = Int8.deserialize(readBuffer);
    expect(int8.value).toEqual(value);
  });

  const serializeAndDeserializeCases = [-128, -1, 0, 1, 127];

  it.each(serializeAndDeserializeCases)('Int8 should serialize and deserialize into the same value', async (value) => {
    const int8 = new Int8(value);
    const writeBuffer = new WriteBuffer();
    await int8.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
    const deserializedInt8 = Int8.deserialize(readBuffer);
    expect(deserializedInt8.value).toEqual(value);
  });

  it.each([-129, 128])('Should not accept values exceeding allowed range', (value) => {
    expect(() => new Int8(value)).toThrow();
  });
});
