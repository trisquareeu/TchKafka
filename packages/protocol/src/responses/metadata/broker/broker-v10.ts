import { TagSection } from '../../../commons';
import { CompactNullableString, CompactString, Int32 } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';

export class BrokerV10 {
  constructor(
    public readonly nodeId: Int32,
    public readonly host: CompactString,
    public readonly port: Int32,
    public readonly rack: CompactNullableString,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): BrokerV10 {
    return new BrokerV10(
      Int32.deserialize(buffer),
      CompactString.deserialize(buffer),
      Int32.deserialize(buffer),
      CompactNullableString.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
