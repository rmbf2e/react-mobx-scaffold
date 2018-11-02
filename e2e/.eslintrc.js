module.exports = {
  plugins: ['jest'],
  extends: ['plugin:jest/recommended'],
  env: {
    'jest/globals': true,
  },
  globals: {
    jestPuppeteer: true,
    browser: true,
    page: true,
    context: true,
  },
  rules: {
    'react/prop-types': 0,
  },
}
