import { type AuthMessageSender, type SaslMechanism } from '../..';

export class PlainSaslMechanism implements SaslMechanism {
  constructor(
    private readonly username: string,
    private readonly password: string
  ) {}

  public getName(): string {
    return 'PLAIN';
  }

  public async authenticate(sendAuthMessage: AuthMessageSender): Promise<void> {
    const credentials = `\0${this.username}\0${this.password}`;

    const authResponse = await sendAuthMessage(Buffer.from(credentials));

    if (authResponse.errorCode.value !== 0) {
      throw new Error(`SASL PLAIN authentication failed`);
    }
  }
}
