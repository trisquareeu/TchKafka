import { Int32 } from '../../primitives';
import type { ReadBuffer } from '../../serialization';
import type { ResponseHeader } from './response-header';

/**
 * Response Header v0 => correlation_id
 *   correlation_id => INT32
 *
 * @see https://kafka.apache.org/24/protocol.html#protocol_messages
 */
export class ResponseHeaderV0 implements ResponseHeader {
  constructor(public readonly correlationId: Int32) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ResponseHeaderV0> {
    const correlationId = await Int32.deserialize(buffer);

    return new ResponseHeaderV0(correlationId);
  }
}
