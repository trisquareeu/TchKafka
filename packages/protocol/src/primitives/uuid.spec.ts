import { type UUID } from 'crypto';
import { IllegalArgumentError } from '../exceptions';
import { ReadBuffer, WriteBuffer } from '../serialization';
import { Uuid } from './uuid';

describe('Uuid', () => {
  it('Should correctly deserialize 16 bytes from buffer', async () => {
    const buffer = new ReadBuffer(
      Buffer.from([
        //17 bytes
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10
      ])
    );
    const uuid = await Uuid.deserialize(buffer);

    expect(uuid.value).toEqual(
      Buffer.from([
        //first 16 bytes from above
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
      ])
    );
  });

  it('Should correctly serialize the value into WriteBuffer', async () => {
    const uuidBytes = Buffer.allocUnsafe(16).fill(42);
    const writeBuffer = new WriteBuffer();
    await new Uuid(uuidBytes).serialize(writeBuffer);

    expect(writeBuffer.toBuffer()).toEqual(uuidBytes);
  });

  it('should create Uuid from UUID', () => {
    const uuid: UUID = '00010203-0405-0607-0809-0a0b0c0d0e0f';

    expect(Uuid.from(uuid).value).toEqual(
      Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f])
    );
  });

  it('should return a zero Uuid', () => {
    expect(Uuid.ZERO.value).toEqual(Buffer.allocUnsafe(16).fill(0));
  });

  const cases = [
    { uuid: Buffer.allocUnsafe(0) },
    { uuid: Buffer.allocUnsafe(1) },
    { uuid: Buffer.allocUnsafe(15) },
    { uuid: Buffer.allocUnsafe(17) },
    { uuid: Buffer.allocUnsafe(32) }
  ];
  it.each(cases)('Should not allow illegal values', ({ uuid }) => {
    expect(() => new Uuid(uuid)).toThrow(IllegalArgumentError);
  });
});
