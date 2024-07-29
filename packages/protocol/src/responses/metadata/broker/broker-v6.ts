import { Int32, NullableString, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';

export class BrokerV6 {
  constructor(
    public readonly nodeId: Int32,
    public readonly host: String,
    public readonly port: Int32,
    public readonly rack: NullableString
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<BrokerV6> {
    return new BrokerV6(
      await Int32.deserialize(buffer),
      await String.deserialize(buffer),
      await Int32.deserialize(buffer),
      await NullableString.deserialize(buffer)
    );
  }
}
