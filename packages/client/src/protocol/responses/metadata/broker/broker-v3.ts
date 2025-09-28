import { Int32, NullableString, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';

export class BrokerV3 {
  constructor(
    public readonly nodeId: Int32,
    public readonly host: String,
    public readonly port: Int32,
    public readonly rack: NullableString
  ) {}

  public static deserialize(buffer: ReadBuffer): BrokerV3 {
    return new BrokerV3(
      Int32.deserialize(buffer),
      String.deserialize(buffer),
      Int32.deserialize(buffer),
      NullableString.deserialize(buffer)
    );
  }
}
