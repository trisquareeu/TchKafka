import { Array, Int16, String } from '../../primitives';
import { type ReadBuffer } from '../../serialization';

export class SaslHandshakeResponseV0 {
  constructor(
    public readonly errorCode: Int16,
    public readonly mechanisms: Array<String>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<SaslHandshakeResponseV0> {
    const errorCode = await Int16.deserialize(buffer);
    const mechanisms = await Array.deserialize(buffer, String.deserialize);

    return new SaslHandshakeResponseV0(errorCode, mechanisms);
  }
}
