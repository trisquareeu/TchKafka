import { Bytes, Int16, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';

export class SaslAuthenticateResponseV0 {
  constructor(
    public readonly errorCode: Int16,
    public readonly errorMessage: NullableString,
    public readonly authBytes: Bytes
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<SaslAuthenticateResponseV0> {
    const errorCode = await Int16.deserialize(buffer);
    const errorMessage = await NullableString.deserialize(buffer);
    const authBytes = await Bytes.deserialize(buffer);

    return new SaslAuthenticateResponseV0(errorCode, errorMessage, authBytes);
  }
}
