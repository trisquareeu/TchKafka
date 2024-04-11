import { KafkaError } from './kafka-error';

export class InvalidTopicError extends KafkaError {
  public static errorCode = 17;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidTopicError';
  }
}
