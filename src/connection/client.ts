import { type RequestBuilderResponseType, type RequestBuilderTemplate } from '../protocol/requests/request-builder';
import { type Session } from './session';
import { type SessionBuilder } from './session-builder';

export class Client {
  private session: Session | null = null;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly sessionBuilder: SessionBuilder
  ) {}

  public async send<T extends RequestBuilderTemplate<any>>(requestBuilder: T): Promise<RequestBuilderResponseType<T>> {
    const session = await this.getOrCreateSession();

    return session.send(requestBuilder);
  }

  private async getOrCreateSession(): Promise<Session> {
    //todo: consider changing this condition
    if (this.session === null || !this.session.isHealthy()) {
      this.session = await this.sessionBuilder.newSession(this.port, this.host);
    }

    return this.session;
  }
}
