import type { JestConfigWithTsJest } from 'ts-jest';
import jestConfig from './jest.config';

const config: JestConfigWithTsJest = {
  ...jestConfig,
  reporters: ['default', ['jest-junit', { outputName: 'junit-unit.xml' }]],
  coverageDirectory: './coverage/unit',
  testMatch: ['<rootDir>/src/**/*.spec.ts']
};

export default config;
