import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV7 } from './response';

export class ProduceResponseV7Data {
  constructor(
    public readonly responses: Array<ResponseV7>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV7Data {
    return new ProduceResponseV7Data(Array.deserialize(buffer, ResponseV7.deserialize), Int32.deserialize(buffer));
  }
}
