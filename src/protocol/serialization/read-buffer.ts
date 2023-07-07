import { BufferUnderflowError } from '../exceptions';

export class ReadBuffer {
  private offset = 0;

  constructor(private readonly buffer: Buffer) {}

  public readInt8(): number {
    return this.readInt(1);
  }

  public readInt16(): number {
    return this.readInt(2);
  }

  public readInt32(): number {
    return this.readInt(4);
  }

  public readInt64(): bigint {
    this.expectByteLength(8);
    const value = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;

    return value;
  }

  public readUInt8(): number {
    return this.readUInt(1);
  }

  public readUInt16(): number {
    return this.readUInt(2);
  }

  public readUInt32(): number {
    return this.readUInt(4);
  }

  public readUInt64(): bigint {
    this.expectByteLength(8);
    const value = this.buffer.readBigUInt64BE(this.offset);
    this.offset += 8;

    return value;
  }

  public readFloat(): number {
    this.expectByteLength(4);
    const value = this.buffer.readFloatBE(this.offset);
    this.offset += 4;

    return value;
  }

  public readDouble(): number {
    this.expectByteLength(8);
    const value = this.buffer.readDoubleBE(this.offset);
    this.offset += 8;

    return value;
  }

  public readString(byteLength: number): string {
    this.expectByteLength(byteLength);
    const value = this.buffer.toString('utf8', this.offset, this.offset + byteLength);
    this.offset += byteLength;

    return value;
  }

  public readBuffer(byteLength: number): Buffer {
    this.expectByteLength(byteLength);
    const value = this.buffer.subarray(this.offset, this.offset + byteLength);
    this.offset += byteLength;

    return value;
  }

  public toBuffer(): Buffer {
    return this.buffer;
  }

  private readInt(byteLength: number): number {
    this.expectByteLength(byteLength);
    const value = this.buffer.readIntBE(this.offset, byteLength);
    this.offset += byteLength;

    return value;
  }

  private readUInt(byteLength: number): number {
    this.expectByteLength(byteLength);
    const value = this.buffer.readUIntBE(this.offset, byteLength);
    this.offset += byteLength;

    return value;
  }

  private expectByteLength(byteLength: number): void {
    const lastByteToRead = this.offset + byteLength;
    if (lastByteToRead > this.buffer.length) {
      throw new BufferUnderflowError(
        `Tried to read ${byteLength} bytes starting from ${this.offset} but the read buffer contains only ${this.buffer.length} bytes in total.`
      );
    }
  }
}
