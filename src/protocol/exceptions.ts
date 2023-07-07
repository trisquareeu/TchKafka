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
