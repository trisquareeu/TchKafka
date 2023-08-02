export class ValueNotInAllowedRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueNotInRangeError';
  }
}

export class IllegalArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalArgumentError';
  }
}

export class NullInNonNullableFieldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NullInNonNullableFieldError';
  }
}

export class TooManyBytesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TooManyBytesError';
  }
}

export class BufferUnderflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BufferUnderflowError';
  }
}

export class CorrelationIdMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CorrelationIdMismatchError';
  }
}

export class InvalidOrOutOfOrderTagError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrOutOfOrderTagError';
  }
}

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

export class InvalidRecordBatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRecordError';
  }
}
