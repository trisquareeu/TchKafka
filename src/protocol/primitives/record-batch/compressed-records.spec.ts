import {
  type Compressor,
  GzipCompressor,
  Lz4Compressor,
  NoopCompressor,
  SnappyCompressor,
  ZstdCompressor
} from '../../compression';
import { ReadBuffer, WriteBuffer } from '../../serialization';
import { Array } from '../array';
import { CompactNullableString } from '../compact-nullable-string';
import { CompressedRecords } from './compressed-records';

describe('CompressedRecords', () => {
  const compressors: Compressor[] = [
    new NoopCompressor(),
    new Lz4Compressor(),
    new SnappyCompressor(),
    new GzipCompressor(),
    new ZstdCompressor()
  ];

  it.each(compressors)('should compress and decompress into the same value', async (compressor) => {
    const array = new Array([
      new CompactNullableString('foo'.repeat(32876)),
      new CompactNullableString(''),
      new CompactNullableString(null)
    ]);

    const compressed = new CompressedRecords(array, compressor);

    const buffer = new WriteBuffer();
    await compressed.serialize(buffer);

    const decompressed = await CompressedRecords.deserialize(
      new ReadBuffer(buffer.toBuffer()),
      CompactNullableString.deserialize,
      compressor
    );

    expect(decompressed.value).toEqual(array);
  });
});
