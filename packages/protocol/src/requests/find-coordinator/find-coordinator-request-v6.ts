import { type TagSection } from '../../commons';
import { type CompactArray, type CompactString, type Int8 } from '../../primitives';
import { ResponseHeaderV1 } from '../../responses';
import { FindCoordinatorResponseV6Data } from '../../responses/find-coordinator';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV2 } from '../headers';
import { type Request } from '../request';

export class FindCoordinatorRequestV6 implements Request<FindCoordinatorResponseV6Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV1;
  public readonly ExpectedResponseDataClass = FindCoordinatorResponseV6Data;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly keyType: Int8,
    public readonly coordinatorKeys: CompactArray<CompactString>,
    public readonly tags: TagSection
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.keyType.serialize(buffer);
    await this.coordinatorKeys.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}
