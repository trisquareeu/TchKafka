import type { Int16, Int32 } from '../../primitives';
import type { WriteBuffer } from '../../serialization';
import type { RequestHeader } from './request-header';

/**
 * Request Header v0 => request_api_key request_api_version correlation_id
 *   request_api_key => INT16
 *   request_api_version => INT16
 *   correlation_id => INT32
 *
 * @see https://kafka.apache.org/24/protocol.html#protocol_messages
 */
export class RequestHeaderV0 implements RequestHeader {
  constructor(
    public readonly requestApiKey: Int16,
    public readonly requestApiVersion: Int16,
    public readonly correlationId: Int32
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.requestApiKey.serialize(buffer);
    await this.requestApiVersion.serialize(buffer);
    await this.correlationId.serialize(buffer);
  }
}
