import { Int32 } from '../../primitives';
import type { ReadBuffer } from '../../serialization';
import type { ResponseHeader } from './response-header';
import { TagSection } from '../../commons';

/**
 * Response Header v1 => correlation_id TAG_BUFFER
 *   correlation_id => INT32
 *
 * @see https://kafka.apache.org/24/protocol.html#protocol_messages
 */
export class ResponseHeaderV1 implements ResponseHeader {
  constructor(
    public readonly correlationId: Int32,
    public readonly tagBuffer: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): ResponseHeaderV1 {
    const correlationId = Int32.deserialize(buffer);
    const tagBuffer = TagSection.deserialize(buffer);

    return new ResponseHeaderV1(correlationId, tagBuffer);
  }
}
