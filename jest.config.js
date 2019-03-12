const reduce = require('lodash/reduce')
const { defaults: tsjPreset } = require('ts-jest/presets')
const { alias } = require('./build/pathAlias')

module.exports = {
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'src/component/**/*.{js,jsx,mjs}',
    'src/page/**/*.{js,jsx,mjs}',
    'src/store/**/*.{js,jsx,mjs}',
    'src/extendStore/**/*.{js,jsx,mjs}',
    'src/mixin/**/*.{js,jsx,mjs}',
    'src/tool/**/*.{js,jsx,mjs}',
  ],
  setupFiles: ['<rootDir>/jest/setup.js'],
  testMatch: ['<rootDir>/__test__/**/*.(spec|test).{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest/afterSetup.js'],
  testEnvironment: 'enzyme',
  testURL: 'http://localhost',
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(css|less)$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/.+(js|jsx|mjs)$'],
  moduleNameMapper: {
    ...reduce(
      alias,
      (r, v, k) => {
        r[`^${k}/(.+)$`] = `${v.replace(__dirname, '<rootDir>')}/$1`
        return r
      },
      {},
    ),
    'history/createBrowserHistory':
      '<rootDir>/node_modules/history/createMemoryHistory',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
}
