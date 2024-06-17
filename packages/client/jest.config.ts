import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coveragePathIgnorePatterns: ['./node_modules/', './dist/', './test'],
  testPathIgnorePatterns: ['./dist', './node_modules'],
  coverageReporters: ['lcov'],
  moduleDirectories: ['./node_modules']
};

export default config;
