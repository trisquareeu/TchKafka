import { ReadBuffer, type Serializable, WriteBuffer } from '../../serialization';
import { Array, CompactNullableBytes, CompactString, Int8, VarInt, VarLong } from '../';

export class RecordHeader implements Serializable {
  constructor(
    private readonly key: CompactString,
    private readonly value: CompactNullableBytes
  ) {}

  public static deserialize(buffer: ReadBuffer): RecordHeader {
    return new RecordHeader(CompactString.deserialize(buffer), CompactNullableBytes.deserialize(buffer));
  }

  public serialize(buffer: WriteBuffer): void {
    this.key.serialize(buffer);
    this.value.serialize(buffer);
  }
}

type RecordParams = {
  attributes?: Int8;
  timestampDelta: VarLong;
  offsetDelta: VarInt;
  key: CompactNullableBytes;
  value: CompactNullableBytes;
  headers: Array<RecordHeader>;
};

/**
 * Record is a single message in a RecordBatch.
 *
 * @see https://kafka.apache.org/documentation/#record
 */
export class Record implements Serializable {
  private readonly attributes: Int8;
  private readonly timestampDelta: VarLong;
  private readonly offsetDelta: VarInt;
  private readonly key: CompactNullableBytes;
  private readonly value: CompactNullableBytes;
  private readonly headers: Array<RecordHeader>;

  constructor(params: RecordParams) {
    this.attributes = params.attributes ?? new Int8(0);
    this.timestampDelta = params.timestampDelta;
    this.offsetDelta = params.offsetDelta;
    this.key = params.key;
    this.value = params.value;
    this.headers = params.headers;
  }

  public static deserialize(buffer: ReadBuffer): Record {
    const length = VarInt.deserialize(buffer).value;
    const temporary = new ReadBuffer(buffer.readBuffer(length));

    const attributes = Int8.deserialize(temporary);
    const timestampDelta = VarLong.deserialize(temporary);
    const offsetDelta = VarInt.deserialize(temporary);
    const key = CompactNullableBytes.deserialize(temporary);
    const value = CompactNullableBytes.deserialize(temporary);
    const headers = Array.deserialize(temporary, RecordHeader.deserialize);

    return new Record({
      attributes,
      timestampDelta,
      offsetDelta,
      key,
      value,
      headers
    });
  }

  public serialize(buffer: WriteBuffer): void {
    const temporary = new WriteBuffer();

    this.attributes.serialize(temporary);
    this.timestampDelta.serialize(temporary);
    this.offsetDelta.serialize(temporary);
    this.key.serialize(temporary);
    this.value.serialize(temporary);
    this.headers.serialize(temporary);

    const tempBuf = temporary.toBuffer();
    new VarInt(tempBuf.length).serialize(buffer);

    buffer.writeBuffer(tempBuf);
  }
}
