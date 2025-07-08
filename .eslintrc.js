module.exports = {
  root: true,
  extends: ["./packages/config/eslint-preset.js"],
  plugins: ["jsx-a11y"],
  rules: {
    "jsx-a11y/anchor-is-valid": "warn",
  },
};
