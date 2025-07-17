import { Array, Int16, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV4 } from './response/response-v4';

export class FetchResponseV4Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly errorCode: Int16,
    public readonly sessionId: Int32,
    public readonly responses: Array<ResponseV4>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<FetchResponseV4Data> {
    return new FetchResponseV4Data(
      await Int32.deserialize(buffer),
      await Int16.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, ResponseV4.deserialize)
    );
  }
}
