import { ReadBuffer, WriteBuffer } from '../serialization';
import { Float64 } from './float64';

describe('Float64', () => {
  const cases = [
    { value: 0, buffer: Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
    { value: 0.1, buffer: Buffer.from([0x3f, 0xb9, 0x99, 0x99, 0x99, 0x99, 0x99, 0x9a]) },
    { value: 0.5, buffer: Buffer.from([0x3f, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
    { value: 1, buffer: Buffer.from([0x3f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
    { value: 1.5, buffer: Buffer.from([0x3f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) },
    { value: -3.1050361846014175e231, buffer: Buffer.from([0xef, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]) }
  ];

  it.each(cases)('value stored in the Float64 should be correctly serialized', async ({ value, buffer }) => {
    const float64 = new Float64(value);
    const writeBuffer = new WriteBuffer();
    await float64.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('byte array should be correctly deserialized to Float64', async ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const float64 = await Float64.deserialize(readBuffer);
    expect(float64.value).toEqual(value);
  });

  const serializeAndDeserializeCases = [-2147483648, -1, 0, 1, 2147483647];

  it.each(serializeAndDeserializeCases)(
    'float64 should serialize and deserialize into the same value',
    async (value) => {
      const float64 = new Float64(value);
      const writeBuffer = new WriteBuffer();
      await float64.serialize(writeBuffer);

      const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
      const deserializedFloat64 = await Float64.deserialize(readBuffer);
      expect(deserializedFloat64.value).toEqual(value);
    }
  );
});
