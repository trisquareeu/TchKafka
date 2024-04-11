export abstract class KafkaError extends Error {
  public static errorCode = -1;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'KafkaError';
  }
}
