import { ReadBuffer, WriteBuffer } from '../../serialization';
import { Record, RecordHeader, RecordHeaderKey, VarIntBytes } from './record';
import { RecordBatch } from './record-batch';
import { CompressionType, HasDeleteHorizon, IsControlBatch, IsTransactional, TimestampType } from './attributes';
import { Int64 } from '../int64';
import { Int32 } from '../int32';
import { Int16 } from '../int16';
import { Array } from '../array';
import { VarLong } from '../varlong';
import { VarInt } from '../varint';
import { CompactArray } from '../compact-array';

describe('RecordBatch', () => {
  const cases = [
    new RecordBatch({
      baseOffset: new Int64(0n),
      partitionLeaderEpoch: new Int32(0),
      attributes: {
        compressionType: CompressionType.GZIP,
        timestampType: TimestampType.LogAppendTime,
        isTransactional: IsTransactional.No,
        isControlBatch: IsControlBatch.Yes,
        hasDeleteHorizon: HasDeleteHorizon.No
      },
      lastOffsetDelta: new Int32(0),
      baseTimestamp: new Int64(0n),
      maxTimestamp: new Int64(0n),
      producerId: new Int64(0n),
      producerEpoch: new Int16(0),
      baseSequence: new Int32(0),
      records: new Array([
        new Record({
          timestampDelta: new VarLong(0n),
          offsetDelta: new VarInt(0),
          key: new VarIntBytes(null),
          value: new VarIntBytes(null),
          headers: new CompactArray([])
        })
      ])
    }),
    new RecordBatch({
      baseOffset: new Int64(Int64.MAX_VALUE),
      partitionLeaderEpoch: new Int32(Int32.MAX_VALUE),
      attributes: {
        compressionType: CompressionType.GZIP,
        timestampType: TimestampType.CreateTime,
        isTransactional: IsTransactional.Yes,
        isControlBatch: IsControlBatch.No,
        hasDeleteHorizon: HasDeleteHorizon.Yes
      },
      lastOffsetDelta: new Int32(Int32.MAX_VALUE),
      baseTimestamp: new Int64(Int64.MAX_VALUE),
      maxTimestamp: new Int64(Int64.MAX_VALUE),
      producerId: new Int64(Int64.MAX_VALUE),
      producerEpoch: new Int16(Int16.MAX_VALUE),
      baseSequence: new Int32(Int32.MAX_VALUE),
      records: new Array([
        new Record({
          timestampDelta: new VarLong(BigInt(VarInt.MAX_VALUE)),
          offsetDelta: new VarInt(VarInt.MAX_VALUE),
          key: new VarIntBytes(Buffer.from('🇵🇱🥸🎓')),
          value: new VarIntBytes(Buffer.from('🇵🇱🥸🎓')),
          headers: new CompactArray([
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓'))),
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓'))),
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓'))),
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓')))
          ])
        }),
        new Record({
          timestampDelta: new VarLong(BigInt(VarInt.MAX_VALUE)),
          offsetDelta: new VarInt(VarInt.MAX_VALUE),
          key: new VarIntBytes(Buffer.from('🇵🇱🥸🎓')),
          value: new VarIntBytes(Buffer.from('🇵🇱🥸🎓')),
          headers: new CompactArray([
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓'))),
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓'))),
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓'))),
            new RecordHeader(new RecordHeaderKey('🇵🇱🥸🎓'), new VarIntBytes(Buffer.from('🇵🇱🥸🎓')))
          ])
        })
      ])
    }),
    new RecordBatch({
      baseOffset: new Int64(Int64.MIN_VALUE),
      partitionLeaderEpoch: new Int32(Int32.MIN_VALUE),
      attributes: {
        compressionType: CompressionType.LZ4,
        timestampType: TimestampType.CreateTime,
        isTransactional: IsTransactional.Yes,
        isControlBatch: IsControlBatch.No,
        hasDeleteHorizon: HasDeleteHorizon.Yes
      },
      lastOffsetDelta: new Int32(Int32.MIN_VALUE),
      baseTimestamp: new Int64(Int64.MIN_VALUE),
      maxTimestamp: new Int64(Int64.MIN_VALUE),
      producerId: new Int64(Int64.MIN_VALUE),
      producerEpoch: new Int16(Int16.MIN_VALUE),
      baseSequence: new Int32(Int32.MIN_VALUE),
      records: new Array([
        new Record({
          timestampDelta: new VarLong(BigInt(VarInt.MIN_VALUE)),
          offsetDelta: new VarInt(VarInt.MIN_VALUE),
          key: new VarIntBytes(Buffer.from([])),
          value: new VarIntBytes(Buffer.from([])),
          headers: new CompactArray([new RecordHeader(new RecordHeaderKey(''), new VarIntBytes(Buffer.from([])))])
        }),
        new Record({
          timestampDelta: new VarLong(BigInt(VarInt.MIN_VALUE)),
          offsetDelta: new VarInt(VarInt.MIN_VALUE),
          key: new VarIntBytes(Buffer.from([])),
          value: new VarIntBytes(Buffer.from([])),
          headers: new CompactArray([new RecordHeader(new RecordHeaderKey(''), new VarIntBytes(Buffer.from([])))])
        }),
        new Record({
          timestampDelta: new VarLong(BigInt(VarInt.MIN_VALUE)),
          offsetDelta: new VarInt(VarInt.MIN_VALUE),
          key: new VarIntBytes(Buffer.from([])),
          value: new VarIntBytes(Buffer.from([])),
          headers: new CompactArray([new RecordHeader(new RecordHeaderKey(''), new VarIntBytes(Buffer.from([])))])
        })
      ])
    }),
    new RecordBatch({
      baseOffset: new Int64(Int64.MIN_VALUE),
      partitionLeaderEpoch: new Int32(Int32.MIN_VALUE),
      attributes: {
        compressionType: CompressionType.ZSTD,
        timestampType: TimestampType.CreateTime,
        isTransactional: IsTransactional.Yes,
        isControlBatch: IsControlBatch.No,
        hasDeleteHorizon: HasDeleteHorizon.Yes
      },
      lastOffsetDelta: new Int32(Int32.MIN_VALUE),
      baseTimestamp: new Int64(Int64.MIN_VALUE),
      maxTimestamp: new Int64(Int64.MIN_VALUE),
      producerId: new Int64(Int64.MIN_VALUE),
      producerEpoch: new Int16(Int16.MIN_VALUE),
      baseSequence: new Int32(Int32.MIN_VALUE),
      records: new Array(null)
    }),
    new RecordBatch({
      baseOffset: new Int64(Int64.MIN_VALUE),
      partitionLeaderEpoch: new Int32(Int32.MIN_VALUE),
      attributes: {
        compressionType: CompressionType.ZSTD,
        timestampType: TimestampType.CreateTime,
        isTransactional: IsTransactional.Yes,
        isControlBatch: IsControlBatch.No,
        hasDeleteHorizon: HasDeleteHorizon.Yes
      },
      lastOffsetDelta: new Int32(Int32.MIN_VALUE),
      baseTimestamp: new Int64(Int64.MIN_VALUE),
      maxTimestamp: new Int64(Int64.MIN_VALUE),
      producerId: new Int64(Int64.MIN_VALUE),
      producerEpoch: new Int16(Int16.MIN_VALUE),
      baseSequence: new Int32(Int32.MIN_VALUE),
      records: new Array([
        new Record({
          timestampDelta: new VarLong(0n),
          offsetDelta: new VarInt(0),
          key: new VarIntBytes(null),
          value: new VarIntBytes(null),
          headers: new CompactArray([new RecordHeader(new RecordHeaderKey(''), new VarIntBytes(null))])
        })
      ])
    })
  ];

  it.each(cases)('should serialize and deserialize into the same value', async (recordBatch) => {
    const writeBuffer = new WriteBuffer();

    await recordBatch.serialize(writeBuffer);

    const buffer = writeBuffer.toBuffer();

    const deserialized = await RecordBatch.deserialize(new ReadBuffer(buffer));
    expect(deserialized).toEqual(recordBatch);
  });

  const buffers = [
    {
      buffer: Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x58, 0xff, 0xff, 0xff, 0xff, 0x02, 0x3d,
        0xd4, 0x54, 0x31, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01, 0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x53,
        0x61, 0x60, 0x60, 0xe0, 0x61, 0x64, 0x62, 0x66, 0x61, 0x65, 0xe3, 0x61, 0xe7, 0xe0, 0xe4, 0xe2, 0xe6, 0x61,
        0x00, 0x00, 0xa8, 0xd7, 0x20, 0x43, 0x13, 0x00, 0x00, 0x00
      ]),
      compressionType: CompressionType.GZIP
    },
    {
      buffer: Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x44, 0xff, 0xff, 0xff, 0xff, 0x02, 0x63,
        0x73, 0x69, 0xaf, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01, 0x24, 0x00, 0x00, 0x00, 0x0c, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
        0x0c, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00
      ]),
      compressionType: CompressionType.None
    },
    {
      buffer: Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x53, 0xff, 0xff, 0xff, 0xff, 0x02, 0x6e,
        0xef, 0x71, 0x92, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01, 0x04, 0x22, 0x4d, 0x18, 0x60, 0x40, 0x82, 0x13, 0x00, 0x00, 0x80,
        0x24, 0x00, 0x00, 0x00, 0x0c, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x0c, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
        0x00, 0x00, 0x00, 0x00, 0x00
      ]),
      compressionType: CompressionType.LZ4
    },
    {
      buffer: Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0xff, 0xff, 0xff, 0xff, 0x02, 0xf3,
        0x90, 0x1d, 0x6f, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01, 0x28, 0xb5, 0x2f, 0xfd, 0x00, 0x58, 0x98, 0x00, 0x00, 0x24, 0x00,
        0x00, 0x00, 0x0c, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x0c, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00, 0x01,
        0x00, 0x00
      ]),
      compressionType: CompressionType.ZSTD
    },
    {
      buffer: Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x5a, 0xff, 0xff, 0xff, 0xff, 0x02, 0x3f,
        0x38, 0x56, 0x46, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x01, 0x82, 0x53, 0x4e, 0x41, 0x50, 0x50, 0x59, 0x00, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x15, 0x13, 0x48, 0x24, 0x00, 0x00, 0x00, 0x0c, 0x01, 0x02,
        0x03, 0x04, 0x05, 0x06, 0x0c, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x00
      ]),
      compressionType: CompressionType.Snappy
    }
  ];

  it.each(buffers)('should deserialize record batch', async ({ buffer, compressionType }) => {
    const deserialized = await RecordBatch.deserialize(new ReadBuffer(buffer));

    expect(deserialized).toBeDefined();
    expect(deserialized.records.value).toHaveLength(1);
    expect(deserialized.records.value![0]!.key.value).toEqual(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]));
    expect(deserialized.records.value![0]!.value.value).toEqual(Buffer.from([0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c]));
    expect(deserialized.attributes.compressionType).toEqual(compressionType);
  });
});