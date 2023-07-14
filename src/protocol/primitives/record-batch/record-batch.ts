import { buf as crc32c } from 'crc-32/crc32c';
import { ReadBuffer, type Serializable, WriteBuffer } from '../../serialization';
import { Array, Int16, Int32, Int64, Int8 } from '../';
import { Record } from './record';
import {
  CompressionType,
  type CompressionTypeValue,
  HasDeleteHorizon,
  type HasDeleteHorizonValue,
  IsControlBatch,
  type IsControlBatchValue,
  IsTransactional,
  type IsTransactionalValue,
  TimestampType,
  type TimestampTypeValue
} from './attributes';

type RecordBatchParams = {
  baseOffset: Int64;
  partitionLeaderEpoch: Int32;
  attributes: RecordBatchAttributes;
  lastOffsetDelta: Int32;
  baseTimestamp: Int64;
  maxTimestamp: Int64;
  producerId: Int64;
  producerEpoch: Int16;
  baseSequence: Int32;
  records: Array<Record>;
};

type RecordBatchAttributes = {
  compression: CompressionTypeValue;
  timestampType: TimestampTypeValue;
  isTransactional: IsTransactionalValue;
  isControlBatch: IsControlBatchValue;
  hasDeleteHorizon: HasDeleteHorizonValue;
};

/**
 * Messages (aka Records) are always written in batches.
 * The technical term for a batch of messages is a record batch, and a record batch contains one or more records.
 * In the degenerate case, we could have a record batch containing a single record.
 *
 * @see https://kafka.apache.org/documentation/#messageformat
 */
export class RecordBatch implements Serializable {
  private readonly baseOffset: Int64;
  private readonly partitionLeaderEpoch: Int32;
  private readonly magic: Int8;
  private readonly attributes: RecordBatchAttributes;
  private readonly lastOffsetDelta: Int32;
  private readonly baseTimestamp: Int64;
  private readonly maxTimestamp: Int64;
  private readonly producerId: Int64;
  private readonly producerEpoch: Int16;
  private readonly baseSequence: Int32;
  private readonly records: Array<Record>;

  constructor(params: RecordBatchParams) {
    this.baseOffset = params.baseOffset;
    this.partitionLeaderEpoch = params.partitionLeaderEpoch;
    this.magic = new Int8(2);
    this.attributes = params.attributes;
    this.lastOffsetDelta = params.lastOffsetDelta;
    this.baseTimestamp = params.baseTimestamp;
    this.maxTimestamp = params.maxTimestamp;
    this.producerId = params.producerId;
    this.producerEpoch = params.producerEpoch;
    this.baseSequence = params.baseSequence;
    this.records = params.records;
  }

  public static deserialize(buffer: ReadBuffer): RecordBatch {
    const baseOffset = Int64.deserialize(buffer);
    const length = Int32.deserialize(buffer).value;
    const temporary = new ReadBuffer(buffer.readBuffer(length));

    const partitionLeaderEpoch = Int32.deserialize(temporary);
    Int8.deserialize(temporary); // magic

    const expectedCrc32 = Int32.deserialize(temporary);
    const calculatedCrc32c = crc32c(temporary.toBuffer(temporary.getOffset()));
    if (calculatedCrc32c !== expectedCrc32.value) {
      throw new Error(`Invalid CRC32 checksum. Expected ${expectedCrc32.value}, got ${calculatedCrc32c}`);
    }

    const attributes = Int16.deserialize(temporary);
    const lastOffsetDelta = Int32.deserialize(temporary);
    const baseTimestamp = Int64.deserialize(temporary);
    const maxTimestamp = Int64.deserialize(temporary);
    const producerId = Int64.deserialize(temporary);
    const producerEpoch = Int16.deserialize(temporary);
    const baseSequence = Int32.deserialize(temporary);
    const records = Array.deserialize(temporary, Record.deserialize);

    return new RecordBatch({
      baseOffset,
      partitionLeaderEpoch,
      attributes: {
        compression: CompressionType.fromInt16(attributes),
        timestampType: TimestampType.fromInt16(attributes),
        isTransactional: IsTransactional.fromInt16(attributes),
        isControlBatch: IsControlBatch.fromInt16(attributes),
        hasDeleteHorizon: HasDeleteHorizon.fromInt16(attributes)
      },
      lastOffsetDelta,
      baseTimestamp,
      maxTimestamp,
      producerId,
      producerEpoch,
      baseSequence,
      records
    });
  }

  public serialize(buffer: WriteBuffer): void {
    const attributes = new Int16(
      this.attributes.compression |
        this.attributes.timestampType |
        this.attributes.isTransactional |
        this.attributes.isControlBatch |
        this.attributes.hasDeleteHorizon
    );

    const body = new WriteBuffer();

    attributes.serialize(body);
    this.lastOffsetDelta.serialize(body);
    this.baseTimestamp.serialize(body);
    this.maxTimestamp.serialize(body);
    this.producerId.serialize(body);
    this.producerEpoch.serialize(body);
    this.baseSequence.serialize(body);
    this.records.serialize(body);

    const batch = new WriteBuffer();
    this.partitionLeaderEpoch.serialize(batch);
    this.magic.serialize(batch);
    new Int32(crc32c(body.toBuffer())).serialize(batch);
    batch.writeBuffer(body.toBuffer());

    const batchBuffer = batch.toBuffer();

    this.baseOffset.serialize(buffer);
    new Int32(batchBuffer.length).serialize(buffer);
    buffer.writeBuffer(batchBuffer);
  }
}
