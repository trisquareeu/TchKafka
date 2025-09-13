import { CompactNullableString, CompactString, Int16, Int32, type ReadBuffer } from '../../..';

export class CoordinatorV6 {
  constructor(
    public readonly key: CompactString,
    public readonly nodeId: Int32,
    public readonly host: CompactString,
    public readonly port: Int32,
    public readonly errorCode: Int16,
    public readonly errorMessage: CompactNullableString
  ) {}

  public static deserialize(buffer: ReadBuffer): CoordinatorV6 {
    const key = CompactString.deserialize(buffer);
    const nodeId = Int32.deserialize(buffer);
    const host = CompactString.deserialize(buffer);
    const port = Int32.deserialize(buffer);
    const errorCode = Int16.deserialize(buffer);
    const errorMessage = CompactNullableString.deserialize(buffer);

    return new CoordinatorV6(key, nodeId, host, port, errorCode, errorMessage);
  }
}
