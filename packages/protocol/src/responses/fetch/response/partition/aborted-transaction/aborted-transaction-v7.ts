import { Int64 } from '../../../../../primitives';
import { type ReadBuffer } from '../../../../../serialization';

export class AbortedTransactionV7 {
  constructor(
    public readonly producerId: Int64,
    public readonly firstOffset: Int64
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<AbortedTransactionV7> {
    return new AbortedTransactionV7(await Int64.deserialize(buffer), await Int64.deserialize(buffer));
  }
}
