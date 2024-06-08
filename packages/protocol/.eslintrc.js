module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.eslint.json']
  },
  env: {
    node: true,
    jest: true,
    es2022: true
  },
  extends: ['../../eslint.base.js'],
  ignorePatterns: ['**/dist']
};
