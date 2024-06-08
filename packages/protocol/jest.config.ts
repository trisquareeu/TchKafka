/* eslint-disable */
export default {
  displayName: 'protocol',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'node'],
  coverageDirectory: '../../coverage/packages/protocol'
};
