import { KafkaError } from './kafka-error';

export class TopicAuthorizationFailedError extends KafkaError {
  public static errorCode = 29;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'TopicAuthorizationFailedError';
  }
}
