import { IllegalArgumentError } from '../../exceptions';
import { ApiVersionsRequestBuilder } from './api-versions-request-builder';
import { ApiVersionsRequestV0 } from './api-versions-request-v0';
import { ApiVersionsRequestV1 } from './api-versions-request-v1';
import { ApiVersionsRequestV3 } from './api-versions-request-v3';

describe('ApiVersionsRequestBuilder', () => {
  let requestBuilder: ApiVersionsRequestBuilder;

  beforeEach(() => {
    requestBuilder = new ApiVersionsRequestBuilder('clientId', 'TchKafka', '1.1.1');
  });

  const cases = [
    { minVersion: 0, maxVersion: 3, expected: ApiVersionsRequestV3 },
    { minVersion: 3, maxVersion: 3, expected: ApiVersionsRequestV3 },
    { minVersion: 0, maxVersion: 0, expected: ApiVersionsRequestV0 },
    { minVersion: 0, maxVersion: 1, expected: ApiVersionsRequestV1 }
  ];

  it.each(cases)(
    'should build request $expected.name with minVersion $minVersion and maxVersion $maxVersion',
    ({ minVersion, maxVersion, expected }) => {
      const request = requestBuilder.build(minVersion, maxVersion);

      expect(request).toBeInstanceOf(expected);
    }
  );

  it('should throw if required range does not overlap with supported one', () => {
    expect(() => requestBuilder.build(5, 10)).toThrow(IllegalArgumentError);
  });

  it('should throw if minVersion is higher than maxVersion', () => {
    expect(() => requestBuilder.build(10, 5)).toThrow(IllegalArgumentError);
  });

  it('should throw if minVersion is negative', () => {
    expect(() => requestBuilder.build(-10, 10)).toThrow(IllegalArgumentError);
  });

  it('should throw if maxVersion is negative', () => {
    expect(() => requestBuilder.build(-10, -10)).toThrow(IllegalArgumentError);
  });
});
