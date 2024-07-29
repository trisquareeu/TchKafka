import { Int16 } from '../../int16';
import { ReadBuffer } from '../../../serialization';
import { IsControlBatch } from './is-control-batch';

describe('IsControlBatch', () => {
  const cases = [
    { buffer: Buffer.from([0x00, 0b00000000]), expected: IsControlBatch.No },
    { buffer: Buffer.from([0x00, 0b00100000]), expected: IsControlBatch.Yes },
    { buffer: Buffer.from([0x00, 0b11100000]), expected: IsControlBatch.Yes },
    { buffer: Buffer.from([0x00, 0b10010001]), expected: IsControlBatch.No },
    { buffer: Buffer.from([0x00, 0b11101110]), expected: IsControlBatch.Yes },
    { buffer: Buffer.from([0x00, 0b11010000]), expected: IsControlBatch.No },
    { buffer: Buffer.from([0b01111111, 0b00100100]), expected: IsControlBatch.Yes },
    { buffer: Buffer.from([0b01111111, 0b00111011]), expected: IsControlBatch.Yes },
    { buffer: Buffer.from([0b10000000, 0b00000000]), expected: IsControlBatch.No },
    { buffer: Buffer.from([0b01010111, 0b00111100]), expected: IsControlBatch.Yes },
    { buffer: Buffer.from([0b01111111, 0b11111111]), expected: IsControlBatch.Yes }
  ];

  it.each(cases)('should return proper control batch value from Int16', async ({ buffer, expected }) => {
    expect(IsControlBatch.fromInt16(await Int16.deserialize(new ReadBuffer(buffer)))).toEqual(expected);
  });
});
