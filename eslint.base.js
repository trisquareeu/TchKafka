module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "prefer-template": "error",
    "no-restricted-imports": ["error"],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: false,
        allowConciseArrowFunctionExpressionsStartingWithVoid: false,
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        overrides: {
          constructors: "no-public",
        },
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "enumMember",
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": [
      "warn",
      {
        allowNullableString: true,
        allowNullableBoolean: true,
      },
    ],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Boolean: false,
          String: false,
        },
      },
    ],
    "newline-before-return": "error",
    "no-throw-literal": "error",
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          "private-static-field",
          "protected-static-field",
          "public-static-field",
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["*.spec.ts"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
