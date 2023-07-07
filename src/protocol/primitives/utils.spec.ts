import { checkValueIsInRange, toUnsigned } from './utils';
import { IllegalArgumentError, ValueNotInAllowedRangeError } from '../exceptions';

describe('utils', () => {
  describe('toUnsigned', () => {
    const cases = [
      { signedValue: -1 & 0xff, expected: 2 ** 8 - 1 },
      { signedValue: -1 & 0xffff, expected: 2 ** 16 - 1 },
      { signedValue: -1 & 0xffffffff, expected: 2 ** 32 - 1 }
    ];

    it.each(cases)('should convert signed values to unsigned', ({ signedValue, expected }) => {
      expect(toUnsigned(signedValue)).toEqual(expected);
    });
  });

  describe('checkValueIsInRange', () => {
    const cases = [
      { value: 0, lowerBound: 0, upperBound: 0 },
      { value: 0, lowerBound: 0, upperBound: 1 },
      { value: 1, lowerBound: 0, upperBound: 1 },
      { value: -1, lowerBound: -2, upperBound: 0 },
      { value: BigInt('0'), lowerBound: BigInt('0'), upperBound: BigInt('1') },
      { value: BigInt('-1'), lowerBound: BigInt('-2'), upperBound: BigInt('0') }
    ];

    it.each(cases)('should not throw when the value is in allowed range', ({ value, lowerBound, upperBound }) => {
      expect(() => checkValueIsInRange(value, lowerBound, upperBound)).not.toThrow();
    });

    it('should throw when the value is outside of the allowed range', () => {
      expect(() => checkValueIsInRange(0, 1, 2)).toThrow(ValueNotInAllowedRangeError);
    });

    it('should throw when the value is outside of the allowed range for BigInt', () => {
      expect(() =>
        checkValueIsInRange(BigInt('9223372036854775808'), BigInt('9223372036854775809'), BigInt('9223372036854775810'))
      ).toThrow(ValueNotInAllowedRangeError);
    });

    it('should throw when the upper bound is lower than lower bound', () => {
      expect(() => checkValueIsInRange(0, 1, 0)).toThrow(IllegalArgumentError);
    });
  });
});
