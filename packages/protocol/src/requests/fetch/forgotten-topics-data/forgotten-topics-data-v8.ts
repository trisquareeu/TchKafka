import { ForgottenTopicsDataV7, ForgottenTopicsDataV7Factory } from './forgotten-topics-data-v7';

export class ForgottenTopicsDataV8 extends ForgottenTopicsDataV7 {}

export class ForgottenTopicsDataV8Factory extends ForgottenTopicsDataV7Factory {
  public override create(): ForgottenTopicsDataV8 {
    return super.create();
  }
}
