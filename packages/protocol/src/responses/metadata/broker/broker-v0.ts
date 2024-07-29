import { Int32, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';

export class BrokerV0 {
  constructor(
    public readonly nodeId: Int32,
    public readonly host: String,
    public readonly port: Int32
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<BrokerV0> {
    return new BrokerV0(
      await Int32.deserialize(buffer),
      await String.deserialize(buffer),
      await Int32.deserialize(buffer)
    );
  }
}
