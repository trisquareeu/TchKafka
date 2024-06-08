import { ReadBuffer, WriteBuffer } from '../serialization';
import { NullableBytes } from './nullable-bytes';

describe('NullableBytes', () => {
  const cases = [
    { value: null, serialized: Buffer.from([0xff, 0xff, 0xff, 0xff]) },
    { value: Buffer.from([]), serialized: Buffer.from([0x00, 0x00, 0x00, 0x00]) },
    { value: Buffer.from([0xff]), serialized: Buffer.from([0x00, 0x00, 0x00, 0x01, 0x0ff]) },
    { value: Buffer.from([0x00, 0x00]), serialized: Buffer.from([0x00, 0x00, 0x00, 0x02, 0x00, 0x00]) },
    { value: Buffer.from([0xff, 0x02, 0xff]), serialized: Buffer.from([0x00, 0x00, 0x00, 0x03, 0xff, 0x02, 0xff]) }
  ];

  it.each(cases)('should serialize properly', async ({ value, serialized }) => {
    const nullableBytes = new NullableBytes(value);
    const buffer = new WriteBuffer();
    await nullableBytes.serialize(buffer);
    expect(buffer.toBuffer()).toEqual(serialized);
  });

  it.each(cases)('should deserialize properly', ({ value, serialized }) => {
    const nullableBytes = NullableBytes.deserialize(new ReadBuffer(serialized));
    expect(nullableBytes.value).toEqual(value);
  });

  it.each(cases)('should serialize and deserialize into the same value', async ({ value }) => {
    const nullableBytes = new NullableBytes(value);
    const buffer = new WriteBuffer();
    await nullableBytes.serialize(buffer);
    const deserializedNullableBytes = NullableBytes.deserialize(new ReadBuffer(buffer.toBuffer()));
    expect(deserializedNullableBytes.value).toEqual(nullableBytes.value);
  });
});
