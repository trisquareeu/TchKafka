import { type RequestBuilderResponseType, type RequestBuilderTemplate } from '../../protocol/requests/request-builder';
import { type Connection } from './connection';
import { type SupportedApiVersions } from './supported-api-versions';

export class Session {
  constructor(
    private readonly connection: Connection,
    private readonly apiVersions: SupportedApiVersions
  ) {}

  public async send<T extends RequestBuilderTemplate<any>>(requestBuilder: T): Promise<RequestBuilderResponseType<T>> {
    const apiVersions = this.apiVersions[requestBuilder.getApiKey()];
    if (apiVersions === undefined) {
      throw new Error(`API key not supported: ${requestBuilder.getApiKey()}`);
    }

    const request = requestBuilder.build(apiVersions.min, apiVersions.max);

    return this.connection.send(request);
  }
}
