module.exports = {
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'src/component/**/*.{js,jsx,mjs}',
    'src/page/**/*.{js,jsx,mjs}',
    'src/store/**/*.{js,jsx,mjs}',
    'src/storeProp/**/*.{js,jsx,mjs}',
    'src/mixin/**/*.{js,jsx,mjs}',
    'src/tool/**/*.{js,jsx,mjs}',
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
    '^component/(.+)$': '<rootDir>/src/component/$1',
    '^page/(.+)$': '<rootDir>/src/page/$1',
    '^tool/(.+)$': '<rootDir>/src/tool/$1',
    '^mixin/(.+)$': '<rootDir>/src/mixin/$1',
    '^store/(.+)$': '<rootDir>/src/store/$1',
    '^storeProp/(.+)$': '<rootDir>/src/storeProp/$1',
    '^src/(.+)$': '<rootDir>/src/$1',
    '^fixture/(.+)$': '<rootDir>/__test__/fixture/$1',
    'history/createBrowserHistory':
      '<rootDir>/node_modules/history/createMemoryHistory',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
}
