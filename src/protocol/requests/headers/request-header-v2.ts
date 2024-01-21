import type { Int16, NullableString } from '../../primitives';
import type { WriteBuffer } from '../../serialization';
import { RequestHeader } from './request-header';
import type { TagSection } from '../../commons';

/**
 * Request Header v2 => request_api_key request_api_version correlation_id client_id TAG_BUFFER
 *   request_api_key => INT16
 *   request_api_version => INT16
 *   correlation_id => INT32
 *   client_id => NULLABLE_STRING
 *
 *  @see https://kafka.apache.org/24/protocol.html#protocol_messages
 */
export class RequestHeaderV2 extends RequestHeader {
  constructor(
    public readonly requestApiKey: Int16,
    public readonly requestApiVersion: Int16,
    public readonly clientId: NullableString,
    public readonly tagBuffer: TagSection
  ) {
    super();
  }

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.requestApiKey.serialize(buffer);
    await this.requestApiVersion.serialize(buffer);
    await this.correlationId.serialize(buffer);
    await this.clientId.serialize(buffer);
    await this.tagBuffer.serialize(buffer);
  }
}
