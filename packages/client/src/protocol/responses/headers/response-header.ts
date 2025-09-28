import type { Int32 } from '../../primitives';

/**
 * A common part of the response headers that is exposed for the matching with original request.
 *
 * CorrelationId - This is a user-supplied integer. It will be passed back in the response by the server, unmodified.
 * It is useful for matching request and response between the client and server.
 *
 * @see https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-Requests
 */
export interface ResponseHeader {
  correlationId: Int32;
}
