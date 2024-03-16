import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV6 } from './response';

export class ProduceResponseV6Data {
  constructor(
    public readonly responses: Array<ResponseV6>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV6Data {
    return new ProduceResponseV6Data(Array.deserialize(buffer, ResponseV6.deserialize), Int32.deserialize(buffer));
  }
}
