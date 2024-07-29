import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { checkValueIsInRange, toUnsigned } from './utils';
import { UVarInt } from './uvarint';

/**
 * Represents an integer between -2^31 and 2^31-1 inclusive.
 * Encoding follows the variable-length zig-zag encoding from Google Protocol Buffers.
 *
 * @see https://kafka.apache.org/protocol.html#protocol_types
 */
export class VarInt implements Serializable {
  public static readonly MAX_VALUE = 2_147_483_647;
  public static readonly MIN_VALUE = -2_147_483_648;

  constructor(private readonly _value: number) {
    checkValueIsInRange(_value, VarInt.MIN_VALUE, VarInt.MAX_VALUE);
  }

  public get value(): number {
    return this._value;
  }

  public static encodeZigZag(value: number): number {
    return toUnsigned((value << 1) ^ (value >> 31));
  }

  public static decodeZigZag(value: number): number {
    return (value >>> 1) ^ -(value & 1);
  }

  public static async deserialize(buffer: ReadBuffer): Promise<VarInt> {
    const uVarInt = await UVarInt.deserialize(buffer);

    return new VarInt(VarInt.decodeZigZag(uVarInt.value));
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await new UVarInt(VarInt.encodeZigZag(this.value)).serialize(buffer);
  }
}
