import type { Int16 } from '../../int16';

/**
 * bit 3: timestampType
 *      0: create time
 *      1: log append time
 *
 * @see https://kafka.apache.org/documentation/#messageformat
 */
export class TimestampType {
  public static readonly CreateTime = 0b00000000_00000000;
  public static readonly LogAppendTime = 0b00000000_00001000;

  public static fromInt16({ value }: Int16): TimestampTypeValue {
    return (value & this.LogAppendTime) as TimestampTypeValue;
  }
}

export type TimestampTypeValue = typeof TimestampType.CreateTime | typeof TimestampType.LogAppendTime;
