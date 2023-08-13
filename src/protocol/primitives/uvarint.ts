import { TooManyBytesError } from '../exceptions';
import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange, toUnsigned } from './utils';

/**
 * An integer stored in variable-length format using unsigned decoding from Google Protocol Buffers.
 * The type is referenced by the primitive types of the Kafka protocol specification, although it's not
 * directly specified.
 *
 * @see https://protobuf.dev/programming-guides/encoding/
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class UVarInt implements Serializable {
  public static readonly MAX_VALUE = 4294967295;
  public static readonly MIN_VALUE = 0;
  private static readonly MAX_BYTES_TO_DECODE = 5;

  constructor(private readonly _value: number) {
    checkValueIsInRange(_value, UVarInt.MIN_VALUE, UVarInt.MAX_VALUE);
  }

  public get value(): number {
    return this._value;
  }

  public static deserialize(buffer: ReadBuffer): UVarInt {
    let decodedValue = 0;
    for (let currentByteNumber = 0; currentByteNumber < this.MAX_BYTES_TO_DECODE; currentByteNumber++) {
      const currentByte = buffer.readUInt8();
      decodedValue |= (currentByte & 0b01111111) << (currentByteNumber * 7);
      //the first bit is a continuation bit, when it is not set, it was the last byte to process
      if ((currentByte & 0b10000000) === 0) {
        //Performing bitwise operations converted the number to signed integer.
        //Unsigned bitshift converts it back to the unsigned one.
        return new UVarInt(toUnsigned(decodedValue));
      }
    }
    throw new TooManyBytesError(`The value exceeds the maximum allowed value of bytes (${this.MAX_VALUE})`);
  }

  public serialize(buffer: WriteBuffer): void {
    let remaining = this.value;
    while (remaining > 0b01111111) {
      //the first bit is a continuation bit
      buffer.writeUInt8(0b10000000 | (remaining & 0b01111111));
      remaining >>>= 7;
    }
    buffer.writeUInt8(0b01111111 & remaining);
  }
}
