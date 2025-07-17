export type ForgottenTopicsDataByName = {
  topic: string;
  partitions: number[];
};
export type ForgottenTopicsDataById = {
  id: string;
  partitions: number[];
};
export type ForgottenTopicsData = ForgottenTopicsDataByName | ForgottenTopicsDataById;

export abstract class ForgottenTopicsDataFactoryTemplate<T> {
  constructor(protected readonly forgottenTopicsData: ForgottenTopicsData) {}

  protected isForgottenTopicsDataByName(
    forgottenTopicsData: ForgottenTopicsData
  ): forgottenTopicsData is ForgottenTopicsDataByName {
    return 'topic' in forgottenTopicsData;
  }

  public abstract create(): T;
}
