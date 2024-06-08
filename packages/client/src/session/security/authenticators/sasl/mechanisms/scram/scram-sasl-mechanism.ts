import { type AuthMessageSender, type SaslMechanism } from '../../sasl-mechanism';
import { Sha256, type HashFunction, Sha512 } from './hash-function';
import { ScramMechanism } from './scram-mechanism';
import { type ScramCredentials } from './scram-credentials';
import { ServerFirstMessage } from './server-first-message';

export abstract class ScramSaslMechanism implements SaslMechanism {
  protected constructor(
    private readonly credentials: ScramCredentials,
    private readonly hashFunction: HashFunction
  ) {}

  public async authenticate(sendAuthMessage: AuthMessageSender): Promise<void> {
    const authentication = await ScramMechanism.next(this.credentials, this.hashFunction);

    const firstMessageResponse = await sendAuthMessage(Buffer.from(authentication.getClientFirstMessage()));
    if (firstMessageResponse.errorCode.value !== 0) {
      throw new Error(`SASL ${this.getName()} authentication failed: ${firstMessageResponse.errorMessage}`);
    }

    const finalMessage = await authentication.getClientFinalMessage(
      new ServerFirstMessage(firstMessageResponse.authBytes.value.toString('utf8'))
    );

    const finalMessageResponse = await sendAuthMessage(Buffer.from(finalMessage));

    if (finalMessageResponse.errorCode.value !== 0) {
      throw new Error(`SASL ${this.getName()} authentication failed: ${finalMessageResponse.errorMessage}`);
    }
  }

  public abstract getName(): string;
}

export class ScramSha256 extends ScramSaslMechanism {
  constructor(credentials: ScramCredentials) {
    super(credentials, Sha256);
  }

  public getName(): string {
    return 'SCRAM-SHA-256';
  }
}

export class ScramSha512 extends ScramSaslMechanism {
  constructor(credentials: ScramCredentials) {
    super(credentials, Sha512);
  }

  public getName(): string {
    return 'SCRAM-SHA-512';
  }
}
