import { Int16 } from '../../int16';
import { ReadBuffer } from '../../../serialization';
import { HasDeleteHorizon } from './has-delete-horizon';

describe('HasDeleteHorizon', () => {
  const cases = [
    { buffer: Buffer.from([0x00, 0b00000000]), expected: HasDeleteHorizon.No },
    { buffer: Buffer.from([0x00, 0b01000000]), expected: HasDeleteHorizon.Yes },
    { buffer: Buffer.from([0x00, 0b11100000]), expected: HasDeleteHorizon.Yes },
    { buffer: Buffer.from([0x00, 0b10010001]), expected: HasDeleteHorizon.No },
    { buffer: Buffer.from([0x00, 0b11101110]), expected: HasDeleteHorizon.Yes },
    { buffer: Buffer.from([0x00, 0b10010000]), expected: HasDeleteHorizon.No },
    { buffer: Buffer.from([0b01111111, 0b01100100]), expected: HasDeleteHorizon.Yes },
    { buffer: Buffer.from([0b01111111, 0b01111011]), expected: HasDeleteHorizon.Yes },
    { buffer: Buffer.from([0b10000000, 0b00000000]), expected: HasDeleteHorizon.No },
    { buffer: Buffer.from([0b01010111, 0b01111100]), expected: HasDeleteHorizon.Yes },
    { buffer: Buffer.from([0b01111111, 0b11111111]), expected: HasDeleteHorizon.Yes }
  ];

  it.each(cases)('should return proper control batch value from Int16', ({ buffer, expected }) => {
    expect(HasDeleteHorizon.fromInt16(Int16.deserialize(new ReadBuffer(buffer)))).toEqual(expected);
  });
});
