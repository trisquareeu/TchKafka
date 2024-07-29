import { CompressionType } from './compression-type';
import { Int16 } from '../../int16';
import { ReadBuffer } from '../../../serialization';
import { IllegalArgumentError } from '../../../exceptions';

describe('CompressionType', () => {
  const cases = [
    { buffer: Buffer.from([0x00, 0b00000000]), expected: CompressionType.None },
    { buffer: Buffer.from([0x00, 0b00000001]), expected: CompressionType.GZIP },
    { buffer: Buffer.from([0x00, 0b00000010]), expected: CompressionType.Snappy },
    { buffer: Buffer.from([0x00, 0b00000011]), expected: CompressionType.LZ4 },
    { buffer: Buffer.from([0x00, 0b00000100]), expected: CompressionType.ZSTD },
    { buffer: Buffer.from([0x00, 0b10001000]), expected: CompressionType.None },
    { buffer: Buffer.from([0x00, 0b10001001]), expected: CompressionType.GZIP },
    { buffer: Buffer.from([0x00, 0b01001010]), expected: CompressionType.Snappy },
    { buffer: Buffer.from([0x00, 0b11001011]), expected: CompressionType.LZ4 },
    { buffer: Buffer.from([0b01111111, 0b00101100]), expected: CompressionType.ZSTD },
    { buffer: Buffer.from([0b01111111, 0b00101011]), expected: CompressionType.LZ4 },
    { buffer: Buffer.from([0b00000000, 0b00000000]), expected: CompressionType.None },
    { buffer: Buffer.from([0b10000000, 0b00000000]), expected: CompressionType.None },
    { buffer: Buffer.from([0b01010111, 0b00101100]), expected: CompressionType.ZSTD },
    { buffer: Buffer.from([0b11010111, 0b00101100]), expected: CompressionType.ZSTD }
  ];

  it.each(cases)('should return proper compression from Int16', async ({ buffer, expected }) => {
    expect(CompressionType.fromInt16(await Int16.deserialize(new ReadBuffer(buffer)))).toEqual(expected);
  });

  const invalidCases = [
    Buffer.from([0x00, 0b00000101]),
    Buffer.from([0xf0, 0b00000110]),
    Buffer.from([0x00, 0b00000111]),
    Buffer.from([0x0f, 0b01001111]),
    Buffer.from([0x00, 0b11001101]),
    Buffer.from([0xff, 0b01101111]),
    Buffer.from([0x00, 0b10101111]),
    Buffer.from([0xf0, 0b11111111]),
    Buffer.from([0x00, 0b11111110]),
    Buffer.from([0xff, 0b11111101]),
    Buffer.from([0x00, 0b11110111]),
    Buffer.from([0b01111111, 0b00101111]),
    Buffer.from([0b11111111, 0b00101110]),
    Buffer.from([0b01110011, 0b00101101]),
    Buffer.from([0b11010111, 0b00101101]),
    Buffer.from([0b01111101, 0b00101111]),
    Buffer.from([0b11110111, 0b00101110])
  ];

  it.each(invalidCases)('should throw an error when compression value is invalid', async (buffer) => {
    const compressionType = await Int16.deserialize(new ReadBuffer(buffer));

    expect(() => CompressionType.fromInt16(compressionType)).toThrow(IllegalArgumentError);
  });
});
