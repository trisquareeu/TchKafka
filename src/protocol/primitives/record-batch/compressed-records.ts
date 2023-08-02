import { type Compressor } from '../../compression';
import { InvalidRecordBatchError } from '../../exceptions';
import { ReadBuffer, WriteBuffer } from '../../serialization';
import { Array } from '../array';
import { Int32 } from '../int32';
import { Record } from './record';

export class CompressedRecords {
  constructor(
    public readonly _value: readonly Record[],
    private readonly compressor: Compressor
  ) {}

  public get value(): readonly Record[] {
    return this._value;
  }

  public static async deserialize(buffer: ReadBuffer, compressor: Compressor): Promise<CompressedRecords> {
    const { value: numberOfRecords } = Int32.deserialize(buffer);
    if (numberOfRecords < 0) {
      throw new InvalidRecordBatchError('Length of records cannot be negative');
    }

    const compressed = buffer.toBuffer(buffer.getOffset());
    const decompressed = new ReadBuffer(await compressor.decompress(compressed));

    const array = Array.deserializeEntries(decompressed, numberOfRecords, Record.deserialize);

    return new CompressedRecords(array.value as Record[], compressor);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    const temporary = new WriteBuffer();

    new Array(this._value).serialize(temporary);

    const temporaryBuffer = temporary.toBuffer();

    const length = temporaryBuffer.subarray(0, 4);
    const compressed = await this.compressor.compress(temporaryBuffer.subarray(4));

    buffer.writeBuffer(length);
    buffer.writeBuffer(compressed);
  }
}
