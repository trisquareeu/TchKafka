import { Int16, Int32, NullableString } from '../../primitives';
import { WriteBuffer } from '../../serialization';
import { RequestHeaderV1 } from './request-header-v1';

describe('RequestHeaderV1', () => {
  it('should properly serialize with all fields set', async () => {
    const header = new RequestHeaderV1(
      new Int16(99),
      new Int16(88),
      new Int32(123456789),
      new NullableString('someClientId')
    );
    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    expect(buffer.toBuffer()).toEqual(
      Buffer.from([
        0x00, 0x63, 0x00, 0x58, 0x07, 0x5b, 0xcd, 0x15, 0x00, 0x0c, 0x73, 0x6f, 0x6d, 0x65, 0x43, 0x6c, 0x69, 0x65,
        0x6e, 0x74, 0x49, 0x64
      ])
    );
  });

  it('should properly serialize when ClientId is set to empty string', async () => {
    const header = new RequestHeaderV1(new Int16(99), new Int16(88), new Int32(123456789), new NullableString(''));

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    expect(buffer.toBuffer()).toEqual(Buffer.from([0x00, 0x63, 0x00, 0x58, 0x07, 0x5b, 0xcd, 0x15, 0x00, 0x00]));
  });

  it('should properly serialize when ClientId is set to null', async () => {
    const header = new RequestHeaderV1(new Int16(99), new Int16(88), new Int32(123456789), new NullableString(null));

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    expect(buffer.toBuffer()).toEqual(Buffer.from([0x00, 0x63, 0x00, 0x58, 0x07, 0x5b, 0xcd, 0x15, 0xff, 0xff]));
  });
});
