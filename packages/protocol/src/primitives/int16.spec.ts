import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int16 } from './int16';

describe('Int16', () => {
  const cases = [
    { value: 0, buffer: Buffer.from([0x00, 0x00]) },
    { value: 1, buffer: Buffer.from([0x00, 0x01]) },
    { value: -1, buffer: Buffer.from([0xff, 0xff]) },
    { value: 127, buffer: Buffer.from([0x00, 0x7f]) },
    { value: -128, buffer: Buffer.from([0xff, 0x80]) },
    { value: 32767, buffer: Buffer.from([0x7f, 0xff]) },
    { value: -32768, buffer: Buffer.from([0x80, 0x00]) }
  ];

  it.each(cases)('value stored in the Int16 should be correctly serialized', async ({ value, buffer }) => {
    const int16 = new Int16(value);
    const writeBuffer = new WriteBuffer();
    await int16.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('byte array should be correctly deserialized to Int16', async ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const int16 = await Int16.deserialize(readBuffer);
    expect(int16.value).toEqual(value);
  });

  const serializeAndDeserializeCases = [-32768, -1, 0, 1, 32767];

  it.each(serializeAndDeserializeCases)('int16 should serialize and deserialize into the same value', async (value) => {
    const int16 = new Int16(value);
    const writeBuffer = new WriteBuffer();
    await int16.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
    const deserializedInt16 = await Int16.deserialize(readBuffer);
    expect(deserializedInt16.value).toEqual(value);
  });

  it.each([-32769, 32768])('should not accept values exceeding allowed range', (value) => {
    expect(() => new Int16(value)).toThrow();
  });
});
