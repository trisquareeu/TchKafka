import {
  RecordBatch,
  Int32,
  CompressionType,
  HasDeleteHorizon,
  IsControlBatch,
  IsTransactional,
  TimestampType,
  Int64,
  Int16,
  Record,
  VarInt,
  VarLong,
  NonNullableArray
} from '../../../../primitives';
import {
  RecordHeader,
  RecordHeaderArray,
  RecordHeaderKey,
  VarIntBytes
} from '../../../../primitives/record-batch/record';
import { WriteBuffer, type Serializable } from '../../../../serialization';
import { PartitionDataFactoryTemplate } from './partition-data-factory';

export class PartitionDataV3 implements Serializable {
  constructor(
    public readonly index: Int32,
    public readonly records: RecordBatch
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.index.serialize(buffer);
    const recordsBuffer = new WriteBuffer();
    await this.records.serialize(recordsBuffer);
    buffer.writeInt32(recordsBuffer.getOffset());
    buffer.writeBuffer(recordsBuffer.toBuffer());
  }
}

export class PartitionDataV3Factory extends PartitionDataFactoryTemplate<PartitionDataV3> {
  public create(): PartitionDataV3 {
    const now = new Date().getTime();
    this.partitionData.records = this.partitionData.records
      .map((record) => ({ ...record, timestamp: record.timestamp ?? now }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const baseTimestamp = this.partitionData.records.at(0)!.timestamp!;

    return new PartitionDataV3(
      new Int32(this.partitionData.index),
      RecordBatch.from({
        attributes: {
          compressionType: CompressionType.None,
          hasDeleteHorizon: HasDeleteHorizon.No,
          isControlBatch: IsControlBatch.No,
          isTransactional: IsTransactional.No,
          timestampType: TimestampType.CreateTime
        },
        baseOffset: new Int64(0n),
        baseSequence: new Int32(10),
        baseTimestamp: new Int64(BigInt(baseTimestamp)),
        lastOffsetDelta: new Int32(this.partitionData.records.length - 1),
        maxTimestamp: new Int64(BigInt(this.partitionData.records.at(-1)!.timestamp!)),
        partitionLeaderEpoch: new Int32(0),
        producerEpoch: new Int16(0),
        producerId: new Int64(-1n),
        records: new NonNullableArray(
          this.partitionData.records.map(
            (record, idx) =>
              new Record({
                headers: new RecordHeaderArray(
                  Object.entries(record.headers).flatMap(([key, value]) => {
                    if (Array.isArray(value)) {
                      return value.map(
                        (v) => new RecordHeader(new RecordHeaderKey(key), new VarIntBytes(Buffer.from(v)))
                      );
                    }

                    return new RecordHeader(new RecordHeaderKey(key), new VarIntBytes(Buffer.from(value)));
                  })
                ),
                key: new VarIntBytes(record.key),
                value: new VarIntBytes(record.value),
                offsetDelta: new VarInt(idx),
                timestampDelta: new VarLong(BigInt((record.timestamp ?? now) - baseTimestamp))
              })
          ),
          (record, buffer) => record.serialize(buffer)
        )
      })
    );
  }
}
