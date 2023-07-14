import type { Int16 } from '../../int16';

/**
 * bit 6: hasDeleteHorizonMs (0 means baseTimestamp is not set as the delete horizon for compaction)
 *
 * Compaction may also modify the baseTimestamp if the record batch contains records with a null payload or aborted
 * transaction markers. The baseTimestamp will be set to the timestamp of when those records should be deleted with the
 * delete horizon attribute bit also set.
 *
 * @see https://kafka.apache.org/documentation/#messageformat
 */
export class HasDeleteHorizon {
  public static readonly No = 0b00000000_00000000;
  public static readonly Yes = 0b00000000_01000000;

  public static fromInt16({ value }: Int16): HasDeleteHorizonValue {
    return (value & HasDeleteHorizon.Yes) as HasDeleteHorizonValue;
  }
}

export type HasDeleteHorizonValue = typeof HasDeleteHorizon.No | typeof HasDeleteHorizon.Yes;
