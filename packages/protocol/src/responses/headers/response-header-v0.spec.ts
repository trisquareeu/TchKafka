import { ReadBuffer } from '../../serialization';
import { Buffer } from 'buffer';
import { ResponseHeaderV0 } from './response-header-v0';

describe('ResponseHeaderV0', () => {
  it('should properly deserialize', async () => {
    const readBuffer = new ReadBuffer(Buffer.from([0x07, 0x5b, 0xcd, 0x15]));

    const header = await ResponseHeaderV0.deserialize(readBuffer);

    expect(header.correlationId.value).toEqual(123456789);
  });
});
