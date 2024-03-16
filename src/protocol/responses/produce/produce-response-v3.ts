import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV3 } from './response';

export class ProduceResponseV3Data {
  constructor(
    public readonly responses: Array<ResponseV3>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV3Data {
    return new ProduceResponseV3Data(Array.deserialize(buffer, ResponseV3.deserialize), Int32.deserialize(buffer));
  }
}
