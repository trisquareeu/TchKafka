import { type Compressor } from '../compression';
import { ReadBuffer, WriteBuffer, type Serializable } from '../serialization';
import { Array, type ArrayDeserializer } from './array';
import { Int32 } from './int32';

export class CompressedArray<T extends Serializable> {
  constructor(
    private readonly _value: Array<T>,
    private readonly compressor: Compressor
  ) {}

  public get value(): Array<T> {
    return this._value;
  }

  public static async deserialize<T extends Serializable>(
    buffer: ReadBuffer,
    deserializer: ArrayDeserializer<T>,
    compressor: Compressor
  ): Promise<CompressedArray<T>> {
    const { value: length } = Int32.deserialize(buffer);
    if (length < 0) {
      return new CompressedArray(new Array(null), compressor);
    }

    const compressed = buffer.toBuffer(buffer.getOffset());
    const decompressed = await compressor.decompress(compressed);

    const temporary = new ReadBuffer(decompressed);
    const array = Array.deserializeEntries(temporary, length, deserializer);

    return new CompressedArray(array, compressor);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    const temporary = new WriteBuffer();

    this.value.serialize(temporary);

    const temporaryBuffer = temporary.toBuffer();

    const length = temporaryBuffer.subarray(0, 4);
    const compressed = await this.compressor.compress(temporaryBuffer.subarray(4));

    buffer.writeBuffer(length);
    buffer.writeBuffer(compressed);
  }
}
