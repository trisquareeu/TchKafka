import {
  GzipCompressor,
  Lz4Compressor,
  NoopCompressor,
  SnappyCompressor,
  ZstdCompressor,
  type Compressor
} from '../../compression';
import { ReadBuffer, WriteBuffer } from '../../serialization';
import { CompactArray } from '../compact-array';
import { Int8 } from '../int8';
import { VarInt } from '../varint';
import { VarLong } from '../varlong';
import { CompressedRecords } from './compressed-records';
import { Record, RecordHeader, RecordHeaderKey, VarIntBytes } from './record';

describe('CompressedRecords', () => {
  const compressors: Compressor[] = [
    new NoopCompressor(),
    new Lz4Compressor(),
    new SnappyCompressor(),
    new GzipCompressor(),
    new ZstdCompressor()
  ];

  it.each(compressors)('should compress and decompress into the same value', async (compressor) => {
    const array = [
      new Record({
        attributes: new Int8(0),
        offsetDelta: new VarInt(0),
        timestampDelta: new VarLong(0n),
        key: new VarIntBytes(Buffer.from('key')),
        value: new VarIntBytes(Buffer.from('value')),
        headers: new CompactArray([
          new RecordHeader(new RecordHeaderKey('headerKey'), new VarIntBytes(Buffer.from('headerValue')))
        ])
      })
    ];

    const compressed = new CompressedRecords(array, compressor);

    const buffer = new WriteBuffer();
    await compressed.serialize(buffer);

    const decompressed = await CompressedRecords.deserialize(new ReadBuffer(buffer.toBuffer()), compressor);

    expect(decompressed._value).toEqual(array);
  });
});
