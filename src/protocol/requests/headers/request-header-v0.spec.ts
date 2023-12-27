import { RequestHeaderV0 } from './request-header-v0';
import { Int16, Int32 } from '../../primitives';
import { WriteBuffer } from '../../serialization';

describe('RequestHeaderV0', () => {
  it('should properly serialize all fields', async () => {
    const header = new RequestHeaderV0(new Int16(99), new Int16(88), new Int32(123456789));
    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    expect(buffer.toBuffer()).toEqual(Buffer.from([0x00, 0x63, 0x00, 0x58, 0x07, 0x5b, 0xcd, 0x15]));
  });
});
