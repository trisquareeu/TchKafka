import { TagSection } from '../../../../../commons';
import { CompactNullableString, Int32 } from '../../../../../primitives';
import { type ReadBuffer } from '../../../../../serialization';

export class RecordErrorV9 {
  constructor(
    public readonly batchIndex: Int32,
    public readonly batchIndexErrorMessage: CompactNullableString,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): RecordErrorV9 {
    return new RecordErrorV9(
      Int32.deserialize(buffer),
      CompactNullableString.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
