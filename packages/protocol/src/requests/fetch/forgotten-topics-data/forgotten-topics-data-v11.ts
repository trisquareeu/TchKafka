import { ForgottenTopicsDataV10, ForgottenTopicsDataV10Factory } from './forgotten-topics-data-v10';

export class ForgottenTopicsDataV11 extends ForgottenTopicsDataV10 {}

export class ForgottenTopicsDataV11Factory extends ForgottenTopicsDataV10Factory {
  public override create(): ForgottenTopicsDataV11 {
    return super.create();
  }
}
