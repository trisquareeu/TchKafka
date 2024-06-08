import { ReadBuffer, WriteBuffer } from '../serialization';
import { UInt32 } from './uint32';

describe('UInt32', () => {
  const cases = [
    { value: 0, buffer: Buffer.from([0x00, 0x00, 0x00, 0x00]) },
    { value: 1, buffer: Buffer.from([0x00, 0x00, 0x00, 0x01]) },
    { value: 4294967295, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff]) }
  ];

  it.each(cases)('value stored in the UInt32 should be correctly serialized', async ({ value, buffer }) => {
    const uint32 = new UInt32(value);
    const writeBuffer = new WriteBuffer();
    await uint32.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('byte array should be correctly deserialized to UInt32', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const uint32 = UInt32.deserialize(readBuffer);
    expect(uint32.value).toEqual(value);
  });

  const serializeAndDeserializeCases = [0, 1, 2 ^ (32 - 1)];

  it.each(serializeAndDeserializeCases)(
    'uInt32 should serialize and deserialize into the same value',
    async (value) => {
      const uint32 = new UInt32(value);
      const writeBuffer = new WriteBuffer();
      await uint32.serialize(writeBuffer);

      const readBuffer = new ReadBuffer(writeBuffer.toBuffer());
      const deserializedUInt32 = UInt32.deserialize(readBuffer);
      expect(deserializedUInt32.value).toEqual(value);
    }
  );

  it.each([-1, 4294967296])('should not accept values exceeding allowed range', (value) => {
    expect(() => new UInt32(value)).toThrow();
  });
});
