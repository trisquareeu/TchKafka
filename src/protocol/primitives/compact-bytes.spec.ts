import { ReadBuffer, WriteBuffer } from '../serialization';
import { CompactBytes } from './compact-bytes';

describe('CompactBytes', () => {
  const cases = [
    { value: Buffer.from([]), serialized: Buffer.from([0x01]) },
    { value: Buffer.from([0x01]), serialized: Buffer.from([0x02, 0x01]) },
    { value: Buffer.from([0x01, 0x02]), serialized: Buffer.from([0x03, 0x01, 0x02]) },
    { value: Buffer.from([0x01, 0x02, 0x03]), serialized: Buffer.from([0x04, 0x01, 0x02, 0x03]) },
    { value: Buffer.from([0x01, 0x02, 0x03, 0x04]), serialized: Buffer.from([0x05, 0x01, 0x02, 0x03, 0x04]) },
    {
      value: Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]),
      serialized: Buffer.from([0x06, 0x01, 0x02, 0x03, 0x04, 0x05])
    }
  ];

  it.each(cases)('should serialize properly', async ({ value, serialized }) => {
    const compactBytes = new CompactBytes(value);
    const buffer = new WriteBuffer();
    await compactBytes.serialize(buffer);
    expect(buffer.toBuffer()).toEqual(serialized);
  });

  it.each(cases)('should deserialize properly', ({ value, serialized }) => {
    const buffer = new ReadBuffer(serialized);
    const compactBytes = CompactBytes.deserialize(buffer);
    expect(compactBytes.value).toEqual(value);
  });

  it.each(cases)('should serialize and deserialize into the same value', async ({ value }) => {
    const compactBytes = new CompactBytes(Buffer.from(value));
    const buffer = new WriteBuffer();
    await compactBytes.serialize(buffer);
    const deserializedCompactBytes = CompactBytes.deserialize(new ReadBuffer(buffer.toBuffer()));
    expect(deserializedCompactBytes.value).toEqual(compactBytes.value);
  });

  it('should throw when deserializing null', () => {
    const buffer = new ReadBuffer(Buffer.from([0x00]));
    expect(() => CompactBytes.deserialize(buffer)).toThrowError();
  });
});
