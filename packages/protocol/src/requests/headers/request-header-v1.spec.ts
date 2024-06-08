import { Int16, NullableString } from '../../primitives';
import { WriteBuffer } from '../../serialization';
import { RequestHeaderV1 } from './request-header-v1';

describe('RequestHeaderV1', () => {
  it('should properly serialize with all fields set', async () => {
    const header = new RequestHeaderV1(new Int16(99), new Int16(88), new NullableString('someClientId'));
    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16)).toEqual('000c736f6d65436c69656e744964');
  });

  it('should properly serialize when ClientId is set to empty string', async () => {
    const header = new RequestHeaderV1(new Int16(99), new Int16(88), new NullableString(''));

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16)).toEqual('0000');
  });

  it('should properly serialize when ClientId is set to null', async () => {
    const header = new RequestHeaderV1(new Int16(99), new Int16(88), new NullableString(null));

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16)).toEqual('ffff');
  });
});
