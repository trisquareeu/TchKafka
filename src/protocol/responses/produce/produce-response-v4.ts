import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV4 } from './response';

export class ProduceResponseV4Data {
  constructor(
    public readonly responses: Array<ResponseV4>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV4Data {
    return new ProduceResponseV4Data(Array.deserialize(buffer, ResponseV4.deserialize), Int32.deserialize(buffer));
  }
}
