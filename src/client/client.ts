import { type Request } from '../protocol/requests';
import { type RequestBuilderResponseType, type RequestBuilderTemplate } from '../protocol/requests/request-builder';
import { type Session, type SessionBuilder } from './session';

export class Client {
  private session: Session | null = null;

  constructor(
    private readonly host: string,
    private readonly port: number,
    public readonly sessionBuilder: SessionBuilder
  ) {}

  public async sendWithoutResponse<T extends Request<any>>(
    requestBuilder: RequestBuilderTemplate<T>
  ): Promise<RequestBuilderResponseType<typeof requestBuilder> | undefined> {
    const session = await this.getOrCreateSession();

    return session.send(requestBuilder).catch((error) => {
      this.session = null;
      throw error;
    });
  }

  public async send<T extends Request<any>>(
    requestBuilder: RequestBuilderTemplate<T>
  ): Promise<RequestBuilderResponseType<typeof requestBuilder>> {
    const response = await this.sendWithoutResponse(requestBuilder);
    if (response === undefined) {
      throw new Error('Response is undefined');
    }

    return response;
  }

  private async getOrCreateSession(): Promise<Session> {
    if (this.session === null) {
      this.session = await this.sessionBuilder.newSession(this.port, this.host);
    }

    return this.session;
  }
}
