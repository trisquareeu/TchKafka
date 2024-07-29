import { TagSection } from '../../../../commons';
import { CompactArray, CompactNullableString, Int16, Int32, Int64 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';
import { RecordErrorV9 } from './record-error';

export class PartitionResponseV9 {
  constructor(
    public readonly index: Int32,
    public readonly errorCode: Int16,
    public readonly baseOffset: Int64,
    public readonly logAppendTime: Int64,
    public readonly logStartOffset: Int64,
    public readonly recordErrors: CompactArray<RecordErrorV9>,
    public readonly errorMessage: CompactNullableString,
    public readonly tags: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<PartitionResponseV9> {
    return new PartitionResponseV9(
      await Int32.deserialize(buffer),
      await Int16.deserialize(buffer),
      await Int64.deserialize(buffer),
      await Int64.deserialize(buffer),
      await Int64.deserialize(buffer),
      await CompactArray.deserialize(buffer, RecordErrorV9.deserialize),
      await CompactNullableString.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
