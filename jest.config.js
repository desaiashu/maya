module.exports = {
  preset: 'react-native',
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
  ],
};
