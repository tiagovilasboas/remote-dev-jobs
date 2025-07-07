module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'boundaries'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  settings: {
    react: {
      version: 'detect'
    },
    'boundaries/elements': [
      { type: 'core', pattern: 'packages/core/src/**' },
      { type: 'application', pattern: 'packages/application/src/**' },
      { type: 'infra', pattern: 'packages/infra/**' },
      { type: 'web', pattern: 'apps/web/**' },
    ],
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.base.json', './tsconfig.json'],
      },
    },
  },
  rules: {
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          { from: 'core', allow: [] },
          { from: 'application', allow: ['core'] },
          { from: 'infra', allow: ['core'] },
          { from: 'web', allow: ['application'] },
        ],
      },
    ],
  }
}; 