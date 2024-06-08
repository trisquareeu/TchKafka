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

  public static deserialize(buffer: ReadBuffer): PartitionResponseV9 {
    return new PartitionResponseV9(
      Int32.deserialize(buffer),
      Int16.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer),
      CompactArray.deserialize(buffer, RecordErrorV9.deserialize),
      CompactNullableString.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
