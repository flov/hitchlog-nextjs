module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    indent: ['error', 2],
    'max-len': ['error', { code: 160 }],
    'no-var-requires': 'off',
    'object-curly-spacing': 'off',
    quotes: ['error', 'single'],
    'import/no-unresolved': 0,
  },
};
