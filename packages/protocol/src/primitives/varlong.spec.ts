import { ValueNotInAllowedRangeError } from '../exceptions';
import { ReadBuffer, WriteBuffer } from '../serialization';
import { Int32 } from './int32';
import { Int64 } from './int64';
import { VarLong } from './varlong';

describe('VarLong', () => {
  const cases = [
    { value: 0n, buffer: Buffer.from([0x00]) },
    { value: -1n, buffer: Buffer.from([0x01]) },
    { value: 1n, buffer: Buffer.from([0x02]) },
    { value: 63n, buffer: Buffer.from([0x7e]) },
    { value: -64n, buffer: Buffer.from([0x7f]) },
    { value: 64n, buffer: Buffer.from([0x80, 0x01]) },
    { value: -65n, buffer: Buffer.from([0x81, 0x01]) },
    { value: 8191n, buffer: Buffer.from([0xfe, 0x7f]) },
    { value: -8192n, buffer: Buffer.from([0xff, 0x7f]) },
    { value: 8192n, buffer: Buffer.from([0x80, 0x80, 0x01]) },
    { value: -8193n, buffer: Buffer.from([0x81, 0x80, 0x01]) },
    { value: 1048575n, buffer: Buffer.from([0xfe, 0xff, 0x7f]) },
    { value: -1048576n, buffer: Buffer.from([0xff, 0xff, 0x7f]) },
    { value: 1048576n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x01]) },
    { value: -1048577n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x01]) },
    { value: 134217727n, buffer: Buffer.from([0xfe, 0xff, 0xff, 0x7f]) },
    { value: -134217728n, buffer: Buffer.from([0xff, 0xff, 0xff, 0x7f]) },
    { value: 134217728n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -134217729n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x01]) },
    { value: BigInt(Int32.MAX_VALUE), buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0x0f]) },
    { value: BigInt(Int32.MIN_VALUE), buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]) },
    { value: 17179869183n, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0x7f]) },
    { value: -17179869184n, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: 17179869184n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -17179869185n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: 2199023255551n, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: -2199023255552n, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: 2199023255552n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -2199023255553n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: 281474976710655n, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: -281474976710656n, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: 281474976710656n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -281474976710657n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 1]) },
    { value: 36028797018963967n, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: -36028797018963968n, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: 36028797018963968n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -36028797018963969n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: 4611686018427387903n, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: -4611686018427387904n, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]) },
    { value: 4611686018427387904n, buffer: Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: -4611686018427387905n, buffer: Buffer.from([0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]) },
    { value: Int64.MAX_VALUE, buffer: Buffer.from([0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]) },
    { value: Int64.MIN_VALUE, buffer: Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01]) }
  ];

  it.each(cases)('should serialize value correctly', async ({ value, buffer }) => {
    const varlong = new VarLong(value);
    const writeBuffer = new WriteBuffer();
    await varlong.serialize(writeBuffer);
    expect(writeBuffer.toBuffer()).toEqual(buffer);
  });

  it.each(cases)('should deserialize value correctly', async ({ value, buffer }) => {
    const readBuffer = new ReadBuffer(buffer);
    const varlong = await VarLong.deserialize(readBuffer);
    expect(varlong.value).toEqual(value);
  });

  it.each(cases)('should serialize and deserialize into the same value', async ({ value, buffer }) => {
    const varlong = new VarLong(value);

    const writeBuffer = new WriteBuffer();
    await varlong.serialize(writeBuffer);

    const readBuffer = new ReadBuffer(buffer);
    const deserialized = await VarLong.deserialize(readBuffer);

    expect(varlong.value).toEqual(deserialized.value);
  });

  it.each([BigInt('-9223372036854775809'), BigInt('9223372036854775808')])(
    'should not accept values exceeding allowed range',
    (value) => {
      expect(() => new VarLong(value)).toThrow(ValueNotInAllowedRangeError);
    }
  );
});
