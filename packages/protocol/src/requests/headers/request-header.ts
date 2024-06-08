import { Int32 } from '../../primitives';
import { type Serializable, type WriteBuffer } from '../../serialization';

/**
 * A common part of all request headers that is exposed for the response matching.
 *
 * CorrelationId - This is a user-supplied integer. It will be passed back in the response by the server, unmodified.
 * It is useful for matching request and response between the client and server.
 *
 * @see https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-Requests
 */
export abstract class RequestHeader implements Serializable {
  private static nextCorrelationId = 0;

  public readonly correlationId: Int32;

  protected constructor() {
    this.correlationId = new Int32(RequestHeader.nextCorrelationId++);
  }

  public abstract serialize(buffer: WriteBuffer): Promise<void>;
}
