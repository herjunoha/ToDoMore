module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|immer|@rneui|react-native-vector-icons|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '^react-native-sqlite-storage$': '<rootDir>/__mocks__/react-native-sqlite-storage.js',
    '^react-native-keychain$': '<rootDir>/__mocks__/react-native-keychain.js',
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
};
