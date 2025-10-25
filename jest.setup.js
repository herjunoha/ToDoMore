// Jest setup file

// Mock console warnings
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
