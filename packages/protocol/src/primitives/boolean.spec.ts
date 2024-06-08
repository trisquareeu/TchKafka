import { ReadBuffer, WriteBuffer } from '../serialization';
import { Boolean } from './boolean';

describe('Boolean', () => {
  const deserializationCases = [
    { value: false, buffer: Buffer.from([0x00]) },
    { value: true, buffer: Buffer.from([0x01]) },
    { value: true, buffer: Buffer.from([0x7f]) },
    { value: true, buffer: Buffer.from([0x80]) },
    { value: true, buffer: Buffer.from([0xff]) }
  ];

  const serializationCases = [
    { value: false, buffer: Buffer.from([0x00]) },
    { value: true, buffer: Buffer.from([0x01]) }
  ];

  it.each(deserializationCases)('should correctly deserialize bytes to boolean', ({ value, buffer }) => {
    const data = new ReadBuffer(buffer);
    expect(Boolean.deserialize(data).value).toBe(value);
  });

  it.each(serializationCases)('should correctly serialize boolean values to bytes', async ({ value, buffer }) => {
    const writeBuffer = new WriteBuffer();
    await new Boolean(value).serialize(writeBuffer);

    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });
});
