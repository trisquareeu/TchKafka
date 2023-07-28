import { Int16, Int32, NullableString } from '../../primitives';
import type { Serializable, WriteBuffer } from '../../serialization';
import type { RequestHeader } from './request-header';
import { TagSection } from '../../commons';

/**
 * Request Header v2 => request_api_key request_api_version correlation_id client_id TAG_BUFFER
 *   request_api_key => INT16
 *   request_api_version => INT16
 *   correlation_id => INT32
 *   client_id => NULLABLE_STRING
 *
 *  @see https://kafka.apache.org/24/protocol.html#protocol_messages
 */
export class RequestHeaderV2 implements Serializable, RequestHeader {
  constructor(
    public readonly requestApiKey: Int16,
    public readonly requestApiVersion: Int16,
    public readonly correlationId: Int32,
    public readonly clientId: NullableString,
    public readonly tagBuffer: TagSection
  ) {}

  public serialize(buffer: WriteBuffer): void {
    this.requestApiKey.serialize(buffer);
    this.requestApiVersion.serialize(buffer);
    this.correlationId.serialize(buffer);
    this.clientId.serialize(buffer);
    this.tagBuffer.serialize(buffer);
  }
}
