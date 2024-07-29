import { Array, Int16, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV7 } from './response/response-v7';

export class FetchResponseV7Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly errorCode: Int16,
    public readonly sessionId: Int32,
    public readonly responses: Array<ResponseV7>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<FetchResponseV7Data> {
    return new FetchResponseV7Data(
      await Int32.deserialize(buffer),
      await Int16.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, ResponseV7.deserialize)
    );
  }
}
