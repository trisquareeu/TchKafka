import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV7 } from './response';

export class ProduceResponseV7Data {
  constructor(
    public readonly responses: Array<ResponseV7>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<ProduceResponseV7Data> {
    return new ProduceResponseV7Data(
      await Array.deserialize(buffer, ResponseV7.deserialize),
      await Int32.deserialize(buffer)
    );
  }
}
