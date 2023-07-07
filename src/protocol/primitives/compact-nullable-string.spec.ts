import { ReadBuffer, WriteBuffer } from '../serialization';
import { CompactNullableString } from './compact-nullable-string';

describe('CompactNullableString', () => {
  const cases = [
    { value: null },
    { value: '' },
    { value: 'a' },
    { value: 'hello world' },
    { value: 'a'.repeat(256) },
    { value: 'a'.repeat(414748364) },
    { value: '¤¤¤' }
  ];

  it.each(cases)('serialize and deserialize into the same value', ({ value }) => {
    const string = new CompactNullableString(value);
    const writeBuffer = new WriteBuffer();
    string.serialize(writeBuffer);

    const buffer = writeBuffer.toBuffer();
    const readBuffer = new ReadBuffer(buffer);
    const deserializedString = CompactNullableString.deserialize(readBuffer);

    expect(deserializedString.value).toEqual(value);
  });
});
