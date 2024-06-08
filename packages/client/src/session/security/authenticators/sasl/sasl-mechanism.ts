import { type RequestResponseType, type SaslAuthenticateRequest } from '@tchkafka/protocol';

export type AuthMessageSender = (message: Buffer) => Promise<RequestResponseType<SaslAuthenticateRequest>>;

export interface SaslMechanism {
  getName(): string;
  authenticate(sendAuthMessage: AuthMessageSender): Promise<void>;
}
