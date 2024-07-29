import { NullInNonNullableFieldError } from '../../exceptions';
import { ReadBuffer, WriteBuffer, type Serializable } from '../../serialization';
import { Int8 } from '../int8';
import { VarInt } from '../varint';
import { VarLong } from '../varlong';

/**
 *  headerKeyLength: varint
 *  headerKey: String
 *  headerValueLength: varint
 *  Value: byte[]
 *
 *  @see https://kafka.apache.org/documentation/#recordheader
 */
export class RecordHeader implements Serializable {
  constructor(
    public readonly key: RecordHeaderKey,
    public readonly value: VarIntBytes
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<RecordHeader> {
    const key = await RecordHeaderKey.deserialize(buffer);
    const value = await VarIntBytes.deserialize(buffer);

    return new RecordHeader(key, value);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.key.serialize(buffer);
    await this.value.serialize(buffer);
  }
}

export class RecordHeaderArray implements Serializable {
  constructor(private readonly _value: RecordHeader[]) {}

  public get value(): readonly RecordHeader[] {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<RecordHeaderArray> {
    const length = await VarInt.deserialize(buffer);

    const value: RecordHeader[] = [];
    for (let i = 0; i < length.value; i++) {
      value.push(await RecordHeader.deserialize(buffer));
    }

    return new RecordHeaderArray(value);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await new VarInt(this.value.length).serialize(buffer);
    for (const item of this.value) {
      await item.serialize(buffer);
    }
  }
}

type RecordParams = {
  attributes?: Int8;
  timestampDelta: VarLong;
  offsetDelta: VarInt;
  key: VarIntBytes;
  value: VarIntBytes;
  headers: RecordHeaderArray;
};

/**
 * Record is a single message in a RecordBatch.
 *
 *  length: varint
 *  attributes: int8
 *      bit 0~7: unused
 *  timestampDelta: varlong
 *  offsetDelta: varint
 *  keyLength: varint
 *  key: byte[]
 *  valueLen: varint
 *  value: byte[]
 *  Headers => [Header]
 *
 * @see https://kafka.apache.org/documentation/#record
 */
export class Record implements Serializable {
  public readonly attributes: Int8;
  public readonly timestampDelta: VarLong;
  public readonly offsetDelta: VarInt;
  public readonly key: VarIntBytes;
  public readonly value: VarIntBytes;
  public readonly headers: RecordHeaderArray;

  constructor(params: RecordParams) {
    this.attributes = params.attributes ?? new Int8(0);
    this.timestampDelta = params.timestampDelta;
    this.offsetDelta = params.offsetDelta;
    this.key = params.key;
    this.value = params.value;
    this.headers = params.headers;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<Record> {
    const length = await VarInt.deserialize(buffer);
    const temporary = new ReadBuffer(buffer.readBuffer(length.value));

    const attributes = await Int8.deserialize(temporary);
    const timestampDelta = await VarLong.deserialize(temporary);
    const offsetDelta = await VarInt.deserialize(temporary);
    const key = await VarIntBytes.deserialize(temporary);
    const value = await VarIntBytes.deserialize(temporary);
    const headers = await RecordHeaderArray.deserialize(temporary);

    return new Record({
      attributes,
      timestampDelta,
      offsetDelta,
      key,
      value,
      headers
    });
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    const temporary = new WriteBuffer();

    await this.attributes.serialize(temporary);
    await this.timestampDelta.serialize(temporary);
    await this.offsetDelta.serialize(temporary);
    await this.key.serialize(temporary);
    await this.value.serialize(temporary);
    await this.headers.serialize(temporary);

    const tempBuf = temporary.toBuffer();
    await new VarInt(tempBuf.length).serialize(buffer);

    buffer.writeBuffer(tempBuf);
  }
}

export class VarIntBytes implements Serializable {
  constructor(private readonly _value: Buffer | null) {}

  public get value(): Buffer | null {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<VarIntBytes> {
    const length = await VarInt.deserialize(buffer);
    if (length.value < 0) {
      return new VarIntBytes(null);
    }

    const bytes = buffer.readBuffer(length.value);

    return new VarIntBytes(bytes);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    if (this.value === null) {
      await new VarInt(-1).serialize(buffer);
    } else {
      await new VarInt(this.value.length).serialize(buffer);
      buffer.writeBuffer(this.value);
    }
  }
}

export class RecordHeaderKey implements Serializable {
  constructor(private readonly _value: string) {}

  public get value(): string {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer): Promise<RecordHeaderKey> {
    const varIntBytes = await VarIntBytes.deserialize(buffer);
    if (varIntBytes.value === null) {
      throw new NullInNonNullableFieldError('RecordHeaderKey cannot be null');
    }

    return new RecordHeaderKey(varIntBytes.value.toString('utf-8'));
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await new VarIntBytes(Buffer.from(this.value, 'utf-8')).serialize(buffer);
  }
}
