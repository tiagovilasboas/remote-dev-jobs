module.exports = {
  root: true,
  extends: ['@remote-dev-jobs/config/eslint'],
  plugins: ['jsx-a11y', 'formatjs'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'formatjs/no-literal-string': ['warn', { ignoreProps: ['testID'] }],
  },
}; 