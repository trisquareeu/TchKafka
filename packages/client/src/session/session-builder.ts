import { ApiVersionsRequestBuilder } from '@tchkafka/protocol';
import { Connection, type SocketFactory } from './connection';
import { type Authenticator } from './security';
import { Session } from './session';
import { type SessionOptions } from './session-options';
import { type SupportedApiVersions } from './supported-api-versions';

export class SessionBuilder {
  constructor(
    private readonly socketFactory: SocketFactory,
    private readonly authenticator: Authenticator,
    private readonly clientOptions: SessionOptions
  ) {}

  public async newSession(port: number, host: string): Promise<Session> {
    const socket = await this.socketFactory.connect(port, host, this.clientOptions.connectionTimeout);
    const connection = new Connection(socket);

    await this.authenticator.authenticate(connection);

    const apiVersions = await this.getApiVersions(connection);

    return new Session(connection, apiVersions);
  }

  private async getApiVersions(connection: Connection): Promise<SupportedApiVersions> {
    const request = new ApiVersionsRequestBuilder(
      this.clientOptions.clientId,
      this.clientOptions.clientSoftwareName,
      this.clientOptions.clientSoftwareVersion
    ).build(0, 3);

    const { apiVersions } = await connection.send(request);
    if (apiVersions.value === null) {
      throw new Error('Received null response');
    }

    //todo: fallback to supported ApiVersions in case of error

    return apiVersions.value.reduce<SupportedApiVersions>((acc, { apiKey, minVersion, maxVersion }) => {
      acc[apiKey.value] = { min: minVersion.value, max: maxVersion.value };

      return acc;
    }, {});
  }
}
