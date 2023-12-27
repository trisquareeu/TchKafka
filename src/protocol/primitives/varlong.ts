import { TooManyBytesError } from '../exceptions';
import { type ReadBuffer, type Serializable, type WriteBuffer } from '../serialization';
import { checkValueIsInRange } from './utils';

/**
 * Represents an integer between -2^63 and 2^63-1 inclusive.
 * Encoding follows the variable-length zig-zag encoding from Google Protocol Buffers.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class VarLong implements Serializable {
  public static readonly MIN_VALUE = BigInt('-9223372036854775808');
  public static readonly MAX_VALUE = BigInt('9223372036854775807');
  private static readonly MAX_BYTES_TO_DECODE = 10;

  constructor(private readonly _value: bigint) {
    checkValueIsInRange(_value, VarLong.MIN_VALUE, VarLong.MAX_VALUE);
  }

  public get value(): bigint {
    return this._value;
  }

  public static encodeZigZag(value: bigint): bigint {
    return (value << 1n) ^ (value >> 63n);
  }

  public static decodeZigZag(value: bigint): bigint {
    return (value >> BigInt.asUintN(64, 1n)) ^ -(value & 1n);
  }

  public static deserialize(buffer: ReadBuffer): VarLong {
    let value = 0n;
    for (let currentByteNumber = 0; currentByteNumber < this.MAX_BYTES_TO_DECODE; currentByteNumber++) {
      const currentByte = buffer.readUInt8();
      value |= BigInt(currentByte & 0b01111111) << BigInt(currentByteNumber * 7);
      //the first bit is a continuation bit, when it is not set, it was the last byte to process
      if ((currentByte & 0b10000000) === 0) {
        return new VarLong(VarLong.decodeZigZag(value));
      }
    }

    throw new TooManyBytesError(`The value exceeds the maximum allowed value of bytes (${this.MAX_BYTES_TO_DECODE})`);
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    let value = VarLong.encodeZigZag(this.value);
    while ((value & 0xffffffffffffff80n) !== 0n) {
      buffer.writeUInt8(Number((value & 0x7fn) | 0x80n));
      value = value >> 7n;
    }
    buffer.writeUInt8(Number(value));
  }
}
