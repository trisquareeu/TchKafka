import { IllegalArgumentError, ValueNotInAllowedRangeError } from '../exceptions';

export const toUnsigned = (signedInteger: number): number => signedInteger >>> 0;

export const checkValueIsInRange = <T extends number | bigint>(value: T, minValue: T, maxValue: T): void => {
  if (minValue > maxValue) {
    throw new IllegalArgumentError('The maxValue must be greater or equal to the minValue');
  }
  if (value < minValue || value > maxValue) {
    throw new ValueNotInAllowedRangeError(`Value ${value} must be between ${minValue} and ${maxValue}`);
  }
};
