import { ReadBuffer, WriteBuffer } from '../serialization';
import { Uuid } from './uuid';
import { IllegalArgumentError } from '../exceptions';

describe('Uuid', () => {
  it('Should correctly deserialize 16 bytes from buffer', () => {
    const buffer = new ReadBuffer(
      Buffer.from([
        //17 bytes
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10
      ])
    );

    expect(Uuid.deserialize(buffer).value).toEqual(
      Buffer.from([
        //first 16 bytes from above
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
      ])
    );
  });

  it('Should correctly serialize the value into WriteBuffer', () => {
    const uuidBytes = Buffer.allocUnsafe(16).fill(42);
    const writeBuffer = new WriteBuffer();
    new Uuid(uuidBytes).serialize(writeBuffer);

    expect(writeBuffer.toBuffer()).toEqual(uuidBytes);
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
