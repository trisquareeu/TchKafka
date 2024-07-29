import { ReadBuffer } from '../../serialization';
import { Buffer } from 'buffer';
import { ResponseHeaderV1 } from './response-header-v1';

describe('ResponseHeaderV1', () => {
  it('should properly deserialize header with no tagged fields', async () => {
    const readBuffer = new ReadBuffer(Buffer.from([0x07, 0x5b, 0xcd, 0x15, 0x00]));

    const header = await ResponseHeaderV1.deserialize(readBuffer);

    expect(header.correlationId.value).toEqual(123456789);
    expect(header.tagBuffer.fields.length).toEqual(0);
  });

  it('should properly deserialize header with tagged fields', async () => {
    const readBuffer = new ReadBuffer(
      Buffer.from([
        0x07, 0x5b, 0xcd, 0x15, 0x01, 0x00, 0x0e, 0x0e, 0x73, 0x6f, 0x6d, 0x65, 0x43, 0x6c, 0x75, 0x73, 0x74, 0x65,
        0x72, 0x49, 0x64
      ])
    );

    const header = await ResponseHeaderV1.deserialize(readBuffer);

    expect(header.correlationId.value).toEqual(123456789);
    expect(header.tagBuffer.fields.length).toEqual(1);
    expect(header.tagBuffer.fields[0]!.tag.value).toEqual(0);
    expect(header.tagBuffer.fields[0]!.data).toEqual(
      //CompactNullableString with the value of 'someClusterId'
      Buffer.from([0x0e, 0x73, 0x6f, 0x6d, 0x65, 0x43, 0x6c, 0x75, 0x73, 0x74, 0x65, 0x72, 0x49, 0x64])
    );
  });
});
