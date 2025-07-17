import { ForgottenTopicsDataV9, ForgottenTopicsDataV9Factory } from './forgotten-topics-data-v9';

export class ForgottenTopicsDataV10 extends ForgottenTopicsDataV9 {}

export class ForgottenTopicsDataV10Factory extends ForgottenTopicsDataV9Factory {
  public override create(): ForgottenTopicsDataV10 {
    return super.create();
  }
}
