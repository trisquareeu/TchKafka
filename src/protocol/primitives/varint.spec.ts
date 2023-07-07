import { ReadBuffer, WriteBuffer } from '../serialization';
import { VarInt } from './varint';

describe('VarInt', () => {
  const cases = [
    { value: 0, buffer: Buffer.from([0x00]) },
    { value: -1, buffer: Buffer.from([0x01]) },
    { value: 1, buffer: Buffer.from([0x02]) },
    { value: 63, buffer: Buffer.from([0x7e]) },
    { value: -64, buffer: Buffer.from([0x7f]) },
    { value: 64, buffer: Buffer.from([0x80, 0x01]) },
    { value: -65, buffer: Buffer.from([0x81, 0x01]) },
    { value: 8191, buffer: Buffer.from([0xfe, 0x7f]) },
    { value: -8192, buffer: Buffer.from([0xff, 0x7f]) },
    { value: 8192, buffer: Buffer.from([0x80, 0x80, 0x01]) },
    { value: -8193, buffer: Buffer.from([0x81, 0x80, 0x01]) },
    { value: 1048575, buffer: Buffer.from([0xfe, 0xff, 0x7f]) },
    { value: -1048576, buffer: Buffer.from([0xff, 0xff, 0x7f]) },
    { value: 1048576, buffer: Buffer.from([0x80, 0x80, 0x80, 0x01]) },
    { value: -1048577, buffer: Buffer.from([0x81, 0x80, 0x80, 0x01]) },
    { value: 134217727, buffer: Buffer.from([0xfe, 0xff, 0xff, 0x7f]) },
    { value: -134217728, buffer: Buffer.from([0xff, 0xff, 0xff, 0x7f]) },
    { value: 134217728, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -134217729, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x01]) },
    { value: VarInt.MAX_VALUE, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0x0f]) },
    { value: VarInt.MIN_VALUE, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]) }
  ];

  it.each(cases)('value stored in the varint should be correctly serialized', ({ value, buffer }) => {
    const varint = new VarInt(value);
    const writeBuffer = new WriteBuffer();
    varint.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('bytes should be correctly deserialized to varint', ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const varint = VarInt.deserialize(readBuffer);
    expect(varint.value).toEqual(value);
  });

  it.each(cases)('should serialize and deserialize into the same value', ({ value, buffer }) => {
    const varint = new VarInt(value);

    const writeBuffer = new WriteBuffer();
    varint.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(buffer);
    const deserialized = VarInt.deserialize(readBuffer);

    expect(varint.value).toEqual(deserialized.value);
  });
});
