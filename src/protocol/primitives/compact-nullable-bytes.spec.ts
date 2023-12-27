import { ReadBuffer, WriteBuffer } from '../serialization';
import { CompactNullableBytes } from './compact-nullable-bytes';

describe('CompactNullableBytes', () => {
  const cases = [
    { value: null, serialized: Buffer.from([0x00]) },
    { value: Buffer.from([]), serialized: Buffer.from([0x01]) },
    { value: Buffer.from([0x01]), serialized: Buffer.from([0x02, 0x01]) },
    { value: Buffer.from([0x01, 0x02]), serialized: Buffer.from([0x03, 0x01, 0x02]) },
    { value: Buffer.from([0x01, 0x02, 0x03]), serialized: Buffer.from([0x04, 0x01, 0x02, 0x03]) }
  ];

  it.each(cases)('should serialize properly', async ({ value, serialized }) => {
    const compactNullableBytes = new CompactNullableBytes(value);
    const buffer = new WriteBuffer();
    await compactNullableBytes.serialize(buffer);
    expect(buffer.toBuffer()).toEqual(serialized);
  });

  it.each(cases)('should deserialize properly', ({ value, serialized }) => {
    const buffer = new ReadBuffer(serialized);
    const compactNullableBytes = CompactNullableBytes.deserialize(buffer);
    expect(compactNullableBytes.value).toEqual(value);
  });

  it.each(cases)('should serialize and deserialize into the same value', async ({ value }) => {
    const compactNullableBytes = new CompactNullableBytes(value);
    const buffer = new WriteBuffer();
    await compactNullableBytes.serialize(buffer);
    const deserializedCompactNullableBytes = CompactNullableBytes.deserialize(new ReadBuffer(buffer.toBuffer()));
    expect(deserializedCompactNullableBytes.value).toEqual(compactNullableBytes.value);
  });
});
