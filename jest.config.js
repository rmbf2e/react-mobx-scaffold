module.exports = {
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'app/component/**/*.{js,jsx,mjs}',
    'app/page/**/*.{js,jsx,mjs}',
    'app/store/**/*.{js,jsx,mjs}',
    'app/storeProp/**/*.{js,jsx,mjs}',
    'app/mixin/**/*.{js,jsx,mjs}',
    'app/tool/**/*.{js,jsx,mjs}',
  ],
  setupFiles: ['<rootDir>/jest/setup.js'],
  testMatch: ['<rootDir>/__test__/**/?(*.)(spec|test).{js,jsx,mjs}'],
  setupTestFrameworkScriptFile: '<rootDir>/jest/afterSetup.js',
  // watchPlugins: ['<rootDir>/jest/debounceWatch.js'],
  testEnvironment: 'enzyme',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-7-jest',
    '^.+\\.(css|less)$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es/).+(js|jsx|mjs)$',
  ],
  moduleNameMapper: {
    '^component/(.+)$': '<rootDir>/app/component/$1',
    '^tool/(.+)$': '<rootDir>/app/tool/$1',
    '^mixin/(.+)$': '<rootDir>/app/mixin/$1',
    '^store/(.+)$': '<rootDir>/app/store/$1',
    '^storeProp/(.+)$': '<rootDir>/app/storeProp/$1',
    '^app/(.+)$': '<rootDir>/app/$1',
    'history/createBrowserHistory':
      '<rootDir>/node_modules/history/createMemoryHistory',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
}
