module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        node: true,
        jest: true,
        es2020: true
    },
    extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
    ignorePatterns: ['**/dist'],
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }
        ],
        'prefer-template': 'error',
        'no-restricted-imports': ['error'],
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
                allowDirectConstAssertionInArrowFunctions: false,
                allowConciseArrowFunctionExpressionsStartingWithVoid: false
            }
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                overrides: {
                    constructors: 'no-public'
                }
            }
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'enumMember',
                format: ['PascalCase']
            }
        ],
        '@typescript-eslint/strict-boolean-expressions': [
            'error',
            {
                allowNullableString: true,
                allowNullableBoolean: true
            }
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                fixStyle: 'inline-type-imports'
            }
        ]
    },
    overrides: [
        {
            files: ['*.spec.ts'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'off'
            }
        }
    ]
};
