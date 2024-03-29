import { type RequestBuilderResponseType, type RequestBuilderTemplate } from '../protocol/requests/request-builder';
import { type Session, type SessionBuilder } from './session';

export class Client {
  private session: Session | null = null;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly sessionBuilder: SessionBuilder
  ) {}

  public async send<T extends RequestBuilderTemplate<any>>(requestBuilder: T): Promise<RequestBuilderResponseType<T>> {
    const session = await this.getOrCreateSession();

    return session.send(requestBuilder).catch((error) => {
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
