import { type Request } from '@tchkafka/protocol';
import { type RequestBuilderResponseType, type RequestBuilderTemplate } from '@tchkafka/protocol';
import { type Connection } from './connection';
import { type SupportedApiVersions } from './supported-api-versions';

export class Session {
  constructor(
    private readonly connection: Connection,
    private readonly apiVersions: SupportedApiVersions
  ) {}

  public async send<T extends Request<any>>(
    requestBuilder: RequestBuilderTemplate<T>,
    expectResponse?: true
  ): Promise<RequestBuilderResponseType<typeof requestBuilder>>;
  public async send<T extends Request<any>>(
    requestBuilder: RequestBuilderTemplate<T>,
    expectResponse: false
  ): Promise<undefined>;
  public async send<T extends Request<any>>(
    requestBuilder: RequestBuilderTemplate<T>,
    expectResponse: boolean
  ): Promise<RequestBuilderResponseType<typeof requestBuilder> | undefined>;
  public async send<T extends Request<any>>(
    requestBuilder: RequestBuilderTemplate<T>,
    expectResponse = true
  ): Promise<RequestBuilderResponseType<typeof requestBuilder> | undefined> {
    const apiVersions = this.apiVersions[requestBuilder.getApiKey()];
    if (apiVersions === undefined) {
      throw new Error(`API key not supported: ${requestBuilder.getApiKey()}`);
    }

    const request = requestBuilder.build(apiVersions.min, apiVersions.max);

    return this.connection.send(request, expectResponse);
  }
}
