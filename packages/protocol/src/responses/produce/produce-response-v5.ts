import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV5 } from './response';

export class ProduceResponseV5Data {
  constructor(
    public readonly responses: Array<ResponseV5>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ProduceResponseV5Data> {
    return new ProduceResponseV5Data(
      await Array.deserialize(buffer, ResponseV5.deserialize),
      await Int32.deserialize(buffer)
    );
  }
}
