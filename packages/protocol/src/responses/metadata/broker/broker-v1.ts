import { Int32, NullableString, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';

export class BrokerV1 {
  constructor(
    public readonly nodeId: Int32,
    public readonly host: String,
    public readonly port: Int32,
    public readonly rack: NullableString
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<BrokerV1> {
    return new BrokerV1(
      await Int32.deserialize(buffer),
      await String.deserialize(buffer),
      await Int32.deserialize(buffer),
      await NullableString.deserialize(buffer)
    );
  }
}
