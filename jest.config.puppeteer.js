module.exports = {
  clearMocks: true,
  restoreMocks: true,
  testMatch: ['<rootDir>/e2e/**/?(*.)test.{js,jsx}'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-7-jest',
    '^.+\\.(css|less)$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  preset: 'jest-puppeteer',
}
