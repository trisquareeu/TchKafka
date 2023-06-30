import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]],
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['./node_modules/', './dist/'],
  testPathIgnorePatterns: ['/dist', '/node_modules'],
  coverageReporters: ['lcov'],
  moduleDirectories: ['node_modules']
};

export default config;
