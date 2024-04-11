import { IllegalArgumentError } from '../exceptions';
import { type RequestResponseType, type Request } from './request';

export type RequestBuilderResponseType<T extends RequestBuilderTemplate<any>> = RequestResponseType<
  ReturnType<T['build']>
>;

export abstract class RequestBuilderTemplate<T extends Request<any>> {
  protected constructor(
    private readonly apiKey: number,
    private readonly minSupportedVersion: number,
    private readonly maxSupportedVersion: number
  ) {}

  public getApiKey(): number {
    return this.apiKey;
  }

  public expectResponse(): boolean {
    return true;
  }

  public build(minVersion: number, maxVersion: number): T {
    this.validateVersionIsNotNegative(minVersion, maxVersion);
    this.validateVersionOverlap(minVersion, maxVersion);
    this.validateVersionIsSupported(minVersion, maxVersion);

    return this.buildRequest(minVersion, maxVersion);
  }

  private validateVersionIsNotNegative(minVersion: number, maxVersion: number): void {
    if (minVersion < 0 || maxVersion < 0) {
      throw new IllegalArgumentError(`Min version (${minVersion}) and max version (${maxVersion}) cannot be negative`);
    }
  }

  private validateVersionOverlap(minVersion: number, maxVersion: number): void {
    if (minVersion > maxVersion) {
      throw new IllegalArgumentError(`Min version (${minVersion}) cannot be higher than max version (${maxVersion})`);
    }
  }

  private validateVersionIsSupported(minVersion: number, maxVersion: number): void {
    if (this.maxSupportedVersion < minVersion || this.minSupportedVersion > maxVersion) {
      throw new IllegalArgumentError(
        `Required version range [${minVersion}, ${maxVersion}] does not overlap with supported version range [${this.minSupportedVersion}, ${this.maxSupportedVersion}]`
      );
    }
  }

  protected abstract buildRequest(minVersion: number, maxVersion: number): T;
}
