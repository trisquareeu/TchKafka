import {
  type ApiKey,
  ApiVersionsRequestBuilder,
  SaslAuthenticateRequestBuilder,
  SaslHandshakeRequestBuilder
} from '@tchkafka/protocol';
import { type Connection } from '../../../connection';
import { type Authenticator } from '../authenticator';
import { type SaslMechanism } from './sasl-mechanism';

export class SaslAuthenticator implements Authenticator {
  constructor(
    private readonly mechanism: SaslMechanism,
    private readonly clientId: string | null,
    private readonly clientSoftwareName: string,
    private readonly clientSoftwareVersion: string
  ) {}

  public async authenticate(connection: Connection): Promise<void> {
    const { handshakeVersions, saslAuthenticateApiVersion } = await this.fetchApiVersions(connection);

    await this.performHandshake(connection, handshakeVersions);

    return this.mechanism.authenticate((message) =>
      connection.send(
        new SaslAuthenticateRequestBuilder(message, this.clientId).build(
          saslAuthenticateApiVersion.minVersion.value,
          saslAuthenticateApiVersion.maxVersion.value
        )
      )
    );
  }

  private async performHandshake(connection: Connection, handshakeVersions: ApiKey): Promise<void> {
    const handshakeRequest = await connection.send(
      new SaslHandshakeRequestBuilder(this.mechanism.getName(), this.clientId).build(
        1,
        handshakeVersions.maxVersion.value
      )
    );
    if (handshakeRequest.errorCode.value !== 0) {
      throw new Error(
        `SASL(${this.mechanism.getName()}): error during handshake, enabled mechanisms: ${handshakeRequest.mechanisms.value?.map((e) => e.value).join(', ')}`
      );
    }
  }

  private async fetchApiVersions(connection: Connection): Promise<{
    handshakeVersions: ApiKey;
    saslAuthenticateApiVersion: ApiKey;
  }> {
    const apiVersionsResponse = await connection.send(
      new ApiVersionsRequestBuilder(this.clientId, this.clientSoftwareName, this.clientSoftwareVersion).build(0, 0)
    );
    if (apiVersionsResponse.errorCode.value !== 0 || apiVersionsResponse.apiVersions.value === null) {
      throw new Error(`SASL(${this.mechanism.getName()}): error getting api versions`);
    }

    const handshakeVersions = apiVersionsResponse.apiVersions.value.find(
      (apiVersion) => apiVersion.apiKey.value === SaslHandshakeRequestBuilder.apiKey
    );
    const saslAuthenticateApiVersion = apiVersionsResponse.apiVersions.value.find(
      (apiVersion) => apiVersion.apiKey.value === SaslAuthenticateRequestBuilder.apiKey // TODO we need some way of having this value static in builder class
    );

    if (handshakeVersions === undefined || saslAuthenticateApiVersion === undefined) {
      throw new Error(`SASL(${this.mechanism.getName()}): error getting api versions`);
    }

    if (handshakeVersions.maxVersion.value < 1) {
      throw new Error(
        `SASL(${this.mechanism.getName()}): using old broker version without SASL wrapped around Kafka protocol`
      );
    }

    return { handshakeVersions, saslAuthenticateApiVersion };
  }
}
