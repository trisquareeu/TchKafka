import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV8 } from './response';

export class ProduceResponseV8Data {
  constructor(
    public readonly responses: Array<ResponseV8>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ProduceResponseV8Data> {
    return new ProduceResponseV8Data(
      await Array.deserialize(buffer, ResponseV8.deserialize),
      await Int32.deserialize(buffer)
    );
  }
}
