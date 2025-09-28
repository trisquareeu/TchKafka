import type { Int16 } from '../../int16';

/**
 * bit 4: isTransactional (0 means not transactional)
 */
export class IsTransactional {
  public static readonly No = 0b00000000_00000000;
  public static readonly Yes = 0b00000000_00010000;

  public static fromInt16({ value }: Int16): IsTransactionalValue {
    return (value & IsTransactional.Yes) as IsTransactionalValue;
  }
}

export type IsTransactionalValue = typeof IsTransactional.No | typeof IsTransactional.Yes;
