const webpackResolve = require('./build/webpackResolve')

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-native', 'prettier'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    semi: [2, 'never'],
    'valid-jsdoc': 2,
    'no-debugger': 0,
    'react-native/no-inline-styles': 2,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: webpackResolve,
        },
      },
    },
  },
}
