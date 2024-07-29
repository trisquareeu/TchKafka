import { Array, Int16, Int32, Int8, NullableString } from '../../primitives';
import { RequestHeaderV1 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { FetchRequestV7 } from './fetch-request-v7';
import { type Topic, TopicV7Factory } from './topic';

export type FetchRequest = FetchRequestV7;

export class FetchRequestBuilder extends RequestBuilderTemplate<FetchRequest> {
  private static readonly apiKey = 1;

  constructor(
    private readonly clientId: string | null,
    private readonly replicaId: number,
    private readonly maxWaitTime: number,
    private readonly minBytes: number,
    private readonly maxBytes: number,
    private readonly isolationLevel: number,
    private readonly sessionId: number,
    private readonly sessionEpoch: number,
    private readonly topics: Topic[]
  ) {
    super(FetchRequestBuilder.apiKey, 7, 7);
  }

  protected override buildRequest(_minVersion: number, _maxVersion: number): FetchRequestV7 {
    return new FetchRequestV7(
      new RequestHeaderV1(new Int16(FetchRequestBuilder.apiKey), new Int16(7), new NullableString(this.clientId)),
      new Int32(this.replicaId),
      new Int32(this.maxWaitTime),
      new Int32(this.minBytes),
      new Int32(this.maxBytes),
      new Int8(this.isolationLevel),
      new Int32(this.sessionId),
      new Int32(this.sessionEpoch),
      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      new Array(
        this.topics.map((entry) => new TopicV7Factory(entry).create()),
        async (entry, buffer) => entry.serialize(buffer)
      ),
      new Array<any>([], async () => {})
    );
  }
}
