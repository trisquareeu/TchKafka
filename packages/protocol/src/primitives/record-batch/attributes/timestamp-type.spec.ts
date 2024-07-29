import { Int16 } from '../../int16';
import { ReadBuffer } from '../../../serialization';
import { TimestampType } from './timestamp-type';

describe('TimestampType', () => {
  const cases = [
    { buffer: Buffer.from([0x00, 0b00000000]), expected: TimestampType.CreateTime },
    { buffer: Buffer.from([0x00, 0b00001000]), expected: TimestampType.LogAppendTime },
    { buffer: Buffer.from([0x00, 0b11111000]), expected: TimestampType.LogAppendTime },
    { buffer: Buffer.from([0x00, 0b10001001]), expected: TimestampType.LogAppendTime },
    { buffer: Buffer.from([0x00, 0b11110111]), expected: TimestampType.CreateTime },
    { buffer: Buffer.from([0x00, 0b11001011]), expected: TimestampType.LogAppendTime },
    { buffer: Buffer.from([0b01111111, 0b00100100]), expected: TimestampType.CreateTime },
    { buffer: Buffer.from([0b01111111, 0b00101011]), expected: TimestampType.LogAppendTime },
    { buffer: Buffer.from([0b10000000, 0b00000000]), expected: TimestampType.CreateTime },
    { buffer: Buffer.from([0b11010111, 0b00101100]), expected: TimestampType.LogAppendTime }
  ];

  it.each(cases)('should return proper timestamp type from Int16', async ({ buffer, expected }) => {
    expect(TimestampType.fromInt16(await Int16.deserialize(new ReadBuffer(buffer)))).toEqual(expected);
  });
});
