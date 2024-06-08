import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int64 } from './int64';

describe('Int64', () => {
  const cases = [
    { value: BigInt(0), buffer: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
    { value: BigInt(1), buffer: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]) },
    { value: BigInt(-1), buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]) },
    { value: BigInt(127), buffer: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7f]) },
    { value: BigInt(-128), buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x80]) },
    { value: BigInt(32767), buffer: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7f, 0xff]) },
    { value: BigInt(-32768), buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x80, 0x00]) },
    { value: BigInt('9223372036854775807'), buffer: Buffer.from([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]) },
    { value: BigInt('-9223372036854775808'), buffer: Buffer.from([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) }
  ];

  it.each(cases)('value stored in the Int64 should be correctly serialized', async ({ value, buffer }) => {
    const int64 = new Int64(value);
    const writeBuffer = new WriteBuffer();
    await int64.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('byte array should be correctly deserialized to Int64', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const int64 = Int64.deserialize(readBuffer);
    expect(int64.value).toEqual(value);
  });

  const serializeAndDeserializeCases = [BigInt(-2147483648), BigInt(-1), BigInt(0), BigInt(1), BigInt(2147483647)];

  it.each(serializeAndDeserializeCases)('int64 should serialize and deserialize into the same value', async (value) => {
    const int64 = new Int64(value);
    const writeBuffer = new WriteBuffer();
    await int64.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
    const deserializedInt64 = Int64.deserialize(readBuffer);
    expect(deserializedInt64.value).toEqual(value);
  });

  it.each([BigInt('-9223372036854775809'), BigInt('9223372036854775808')])(
    'should not accept values exceeding allowed range',
    (value) => {
      expect(() => new Int64(value)).toThrow();
    }
  );
});
