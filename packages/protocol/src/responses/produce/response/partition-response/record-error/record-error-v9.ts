import { TagSection } from '../../../../../commons';
import { Int32, CompactNullableString } from '../../../../../primitives';
import { type ReadBuffer } from '../../../../../serialization';

export class RecordErrorV9 {
  constructor(
    public readonly batchIndex: Int32,
    public readonly batchIndexErrorMessage: CompactNullableString,
    public readonly tags: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<RecordErrorV9> {
    return new RecordErrorV9(
      await Int32.deserialize(buffer),
      await CompactNullableString.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
