import { ReadBuffer, WriteBuffer } from '../../serialization';
import { Array, CompactArray, CompactNullableBytes, Int16, Int32, Int64, VarInt, VarLong } from '../';
import { Record, RecordHeader, RecordHeaderKey, VarIntBytes } from './record';
import { RecordBatch } from './record-batch';
import { CompressionType, HasDeleteHorizon, IsControlBatch, IsTransactional, TimestampType } from './attributes';

describe('RecordBatch', () => {
  const cases = [
    new RecordBatch({
      baseOffset: new Int64(0n),
      partitionLeaderEpoch: new Int32(0),
      attributes: {
        compression: CompressionType.Snappy,
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
          timestampDelta: new Int64(0n),
          offsetDelta: new Int32(0),
          key: new CompactNullableBytes(null),
          value: new CompactNullableBytes(null),
          headers: new Array([])
        })
      ])
    }),
    new RecordBatch({
      baseOffset: new Int64(Int64.MAX_VALUE),
      partitionLeaderEpoch: new Int32(Int32.MAX_VALUE),
      attributes: {
        compression: CompressionType.GZIP,
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
        compression: CompressionType.LZ4,
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
        compression: CompressionType.ZSTD,
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
        compression: CompressionType.ZSTD,
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

  it.each(cases)('should serialize and deserialize into the same value', (recordBatch) => {
    const writeBuffer = new WriteBuffer();

    recordBatch.serialize(writeBuffer);

    const buffer = writeBuffer.toBuffer();

    expect(RecordBatch.deserialize(new ReadBuffer(buffer))).toEqual(recordBatch);
  });
});
