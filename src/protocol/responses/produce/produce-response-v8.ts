import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { ResponseV8 } from './response';

export class ProduceResponseV8Data {
  constructor(
    public readonly responses: Array<ResponseV8>,
    public readonly throttleTimeMs: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): ProduceResponseV8Data {
    return new ProduceResponseV8Data(Array.deserialize(buffer, ResponseV8.deserialize), Int32.deserialize(buffer));
  }
}
