import { TagSection } from '../../../../../commons';
import { Int32, CompactNullableString } from '../../../../../primitives';
import { type ReadBuffer } from '../../../../../serialization';

export class RecordErrorV10 {
  constructor(
    public readonly batchIndex: Int32,
    public readonly batchIndexErrorMessage: CompactNullableString,
    public readonly tags: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<RecordErrorV10> {
    return new RecordErrorV10(
      await Int32.deserialize(buffer),
      await CompactNullableString.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
