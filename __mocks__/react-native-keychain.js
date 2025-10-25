// Mock for react-native-keychain

module.exports = {
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  ACCESS_CONTROL: {
    USER_PRESENCE: 'UserPresence',
  },
};
