import { ForgottenTopicsDataV15, ForgottenTopicsDataV15Factory } from './forgotten-topics-data-v15';

export class ForgottenTopicsDataV16 extends ForgottenTopicsDataV15 {}

export class ForgottenTopicsDataV16Factory extends ForgottenTopicsDataV15Factory {
  public override create(): ForgottenTopicsDataV16 {
    return super.create();
  }
}
