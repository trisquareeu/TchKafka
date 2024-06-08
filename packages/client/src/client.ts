import { type Request, type RequestBuilderResponseType, type RequestBuilderTemplate } from '@tchkafka/protocol';
import { type Session, type SessionBuilder } from './session';

export class Client {
  private session: Session | null = null;

  constructor(
    private readonly host: string,
    private readonly port: number,
    public readonly sessionBuilder: SessionBuilder
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
    const session = await this.getOrCreateSession();

    return session.send(requestBuilder, expectResponse as never).catch((error) => {
      this.session = null;
      throw error;
    });
  }

  private async getOrCreateSession(): Promise<Session> {
    if (this.session === null) {
      this.session = await this.sessionBuilder.newSession(this.port, this.host);
    }

    return this.session;
  }
}
