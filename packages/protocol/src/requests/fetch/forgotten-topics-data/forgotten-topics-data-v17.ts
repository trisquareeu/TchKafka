import { ForgottenTopicsDataV16, ForgottenTopicsDataV16Factory } from './forgotten-topics-data-v16';

export class ForgottenTopicsDataV17 extends ForgottenTopicsDataV16 {}

export class ForgottenTopicsDataV17Factory extends ForgottenTopicsDataV16Factory {
  public override create(): ForgottenTopicsDataV17 {
    return super.create();
  }
}
