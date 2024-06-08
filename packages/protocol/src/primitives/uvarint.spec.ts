import { ReadBuffer, WriteBuffer } from '../serialization';
import { UVarInt } from './uvarint';

describe('UVarInt', () => {
  const cases = [
    { value: UVarInt.MIN_VALUE, buffer: Buffer.from([0x00]) },
    { value: 1, buffer: Buffer.from([0x01]) },
    { value: 127, buffer: Buffer.from([0x7f]) },
    { value: 128, buffer: Buffer.from([0x80, 0x01]) },
    { value: 255, buffer: Buffer.from([0xff, 0x01]) },
    { value: 300, buffer: Buffer.from([0xac, 0x02]) },
    { value: 16384, buffer: Buffer.from([0x80, 0x80, 0x01]) },
    { value: UVarInt.MAX_VALUE, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]) }
  ];

  it.each(cases)('value stored in the UVarInt should be correctly serialized', async ({ value, buffer }) => {
    const uvarint = new UVarInt(value);
    const writeBuffer = new WriteBuffer();
    await uvarint.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('bytes should be correctly deserialized to UVarInt', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const uVarInt = UVarInt.deserialize(readBuffer);
    expect(uVarInt.value).toEqual(value);
  });

  const positiveCases = [-1, -2, -Infinity];

  it.each(positiveCases)('should accept only positive integers', (value) => {
    expect(() => new UVarInt(value)).toThrow();
  });

  const serializeAndDeserializeCases = [UVarInt.MIN_VALUE, 2 ** 31 - 1, UVarInt.MAX_VALUE];

  it.each(serializeAndDeserializeCases)('it should serialize and deserialize into the same value', async (value) => {
    const uvarint = new UVarInt(value);
    const writeBuffer = new WriteBuffer();
    await uvarint.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
    const deserializedUVarInt = UVarInt.deserialize(readBuffer);
    expect(deserializedUVarInt.value).toEqual(value);
  });
});
