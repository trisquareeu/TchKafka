import { TagSection } from '../../commons';
import { CompactArray, CompactString, Int16, Int8, NullableString } from '../../primitives';
import { RequestHeaderV2 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { FindCoordinatorRequestV6 } from './find-coordinator-request-v6';

export type FindCoordinatorRequest = FindCoordinatorRequestV6;

export class FindCoordinatorRequestBuilder extends RequestBuilderTemplate<FindCoordinatorRequest> {
  private static readonly apiKey = 10;

  constructor(
    private readonly clientId: string,
    private readonly keyType: number,
    private readonly keys: string[]
  ) {
    super(FindCoordinatorRequestBuilder.apiKey, 6, 6);
  }

  public override getApiKey(): number {
    return FindCoordinatorRequestBuilder.apiKey;
  }

  protected override buildRequest(_minVersion: number, _maxVersion: number): FindCoordinatorRequest {
    return new FindCoordinatorRequestV6(
      new RequestHeaderV2(
        new Int16(FindCoordinatorRequestBuilder.apiKey),
        new Int16(6),
        new NullableString(this.clientId),
        new TagSection()
      ),
      new Int8(this.keyType),
      new CompactArray(
        this.keys.map((key) => new CompactString(key)),
        (key, buffer) => key.serialize(buffer)
      ),
      new TagSection()
    );
  }
}
