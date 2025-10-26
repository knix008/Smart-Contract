module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.html',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
