import { ReadBuffer, WriteBuffer } from '../serialization';
import { CompactString } from './compact-string';

describe('CompactString', () => {
  const cases = [
    { value: '' },
    { value: 'a' },
    { value: 'hello world' },
    { value: 'a'.repeat(256) },
    { value: 'a'.repeat(414748364) },
    { value: '¤¤¤' }
  ];

  it.each(cases)('serialize and deserialize into the same value', async ({ value }) => {
    const string = new CompactString(value);
    const writeBuffer = new WriteBuffer();
    await string.serialize(writeBuffer);

    const buffer = writeBuffer.toBuffer();
    const readBuffer = new ReadBuffer(buffer);
    const deserializedString = CompactString.deserialize(readBuffer);

    expect(deserializedString.value).toEqual(value);
  });

  it('should throw when deserializing null', () => {
    const buffer = new ReadBuffer(Buffer.from([0x00]));
    expect(() => CompactString.deserialize(buffer)).toThrowError();
  });
});
