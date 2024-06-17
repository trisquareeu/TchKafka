import type { JestConfigWithTsJest } from 'ts-jest';
import jestConfig from './jest.config';

const config: JestConfigWithTsJest = {
  ...jestConfig,
  reporters: ['default', ['jest-junit', { outputName: 'junit-integration.xml' }]],
  coverageDirectory: './coverage/integration',
  testMatch: ['<rootDir>/test/**/*.integration.spec.ts']
};

export default config;
