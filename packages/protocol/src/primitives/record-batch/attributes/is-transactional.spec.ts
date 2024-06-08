import { Int16 } from '../../int16';
import { ReadBuffer } from '../../../serialization';
import { IsTransactional } from './is-transactional';

describe('IsTransactional', () => {
  const cases = [
    { buffer: Buffer.from([0x0f, 0b00000000]), expected: IsTransactional.No },
    { buffer: Buffer.from([0x00, 0b00010000]), expected: IsTransactional.Yes },
    { buffer: Buffer.from([0xff, 0b11110000]), expected: IsTransactional.Yes },
    { buffer: Buffer.from([0x00, 0b10010001]), expected: IsTransactional.Yes },
    { buffer: Buffer.from([0xf0, 0b11101110]), expected: IsTransactional.No },
    { buffer: Buffer.from([0x0f, 0b11010000]), expected: IsTransactional.Yes },
    { buffer: Buffer.from([0b01111111, 0b00100100]), expected: IsTransactional.No },
    { buffer: Buffer.from([0b01111111, 0b00111011]), expected: IsTransactional.Yes },
    { buffer: Buffer.from([0b10000000, 0b00000000]), expected: IsTransactional.No },
    { buffer: Buffer.from([0b01010111, 0b00111100]), expected: IsTransactional.Yes },
    { buffer: Buffer.from([0b01111111, 0b11111111]), expected: IsTransactional.Yes }
  ];

  it.each(cases)('should return proper transactional value from Int16', ({ buffer, expected }) => {
    expect(IsTransactional.fromInt16(Int16.deserialize(new ReadBuffer(buffer)))).toEqual(expected);
  });
});
