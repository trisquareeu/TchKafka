import { RequestHeaderV0 } from './request-header-v0';
import { Int16 } from '../../primitives';
import { WriteBuffer } from '../../serialization';

describe('RequestHeaderV0', () => {
  it('should properly serialize all fields', async () => {
    const header = new RequestHeaderV0(new Int16(99), new Int16(88));
    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(8)).toHaveLength(8);
  });
});
