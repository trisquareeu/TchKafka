import { CompactNullableString, Int16, NullableString } from '../../primitives';
import { WriteBuffer } from '../../serialization';
import { RequestHeaderV2 } from './request-header-v2';
import { TaggedField, TagSection } from '../../commons';

describe('RequestHeaderV2', () => {
  it('should properly serialize with all fields set', async () => {
    const header = new RequestHeaderV2(
      new Int16(99),
      new Int16(88),
      new NullableString('someClientId'),
      new TagSection()
    );
    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16, 44)).toEqual('000c736f6d65436c69656e744964');
    expect(serialized.substring(44)).toEqual('00');
  });

  it('should properly serialize when ClientId is set to empty string', async () => {
    const header = new RequestHeaderV2(new Int16(99), new Int16(88), new NullableString(''), new TagSection());

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16, 20)).toEqual('0000');
    expect(serialized.substring(20)).toEqual('00');
  });

  it('should properly serialize when ClientId is set to null', async () => {
    const header = new RequestHeaderV2(new Int16(99), new Int16(88), new NullableString(null), new TagSection());

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16, 20)).toEqual('ffff');
    expect(serialized.substring(20)).toEqual('00');
  });

  it('should properly serialize when using tagged fields', async () => {
    const header = new RequestHeaderV2(
      new Int16(99),
      new Int16(88),
      new NullableString('someClientId'),
      new TagSection([await TaggedField.from(0, new CompactNullableString('someClusterId'))])
    );

    const buffer = new WriteBuffer();
    await header.serialize(buffer);

    const serialized = buffer.toBuffer().toString('hex');
    expect(serialized.substring(0, 4)).toEqual('0063');
    expect(serialized.substring(4, 8)).toEqual('0058');
    expect(serialized.substring(16, 44)).toEqual('000c736f6d65436c69656e744964');
    expect(serialized.substring(44)).toEqual('01000e0e736f6d65436c75737465724964');
  });
});
