import { ForgottenTopicsDataV8, ForgottenTopicsDataV8Factory } from './forgotten-topics-data-v8';

export class ForgottenTopicsDataV9 extends ForgottenTopicsDataV8 {}

export class ForgottenTopicsDataV9Factory extends ForgottenTopicsDataV8Factory {
  public override create(): ForgottenTopicsDataV9 {
    return super.create();
  }
}
