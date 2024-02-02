import { type Connection } from '../../connection';

export interface Authenticator {
  authenticate(connection: Connection): Promise<void>;
}

export class NoOpAuthenticator implements Authenticator {
  public async authenticate(): Promise<void> {}
}
