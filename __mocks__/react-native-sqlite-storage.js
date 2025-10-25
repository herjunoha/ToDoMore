// Mock for react-native-sqlite-storage

const mockDatabase = {
  executeSql: jest.fn((sql, params = []) => {
    // Mock different responses based on SQL queries
    if (sql.includes('SELECT name FROM sqlite_master')) {
      // Mock table exists check
      return Promise.resolve([{
        rows: {
          length: 1,
          item: () => ({ name: 'test_table' }),
          raw: () => [{ name: 'test_table' }],
        },
      }]);
    }
    
    if (sql.includes('INSERT')) {
      // Mock insert success
      return Promise.resolve([{
        insertId: 1,
        rowsAffected: 1,
        rows: { length: 0, item: () => null, raw: () => [] },
      }]);
    }
    
    if (sql.includes('UPDATE') || sql.includes('DELETE')) {
      // Mock update/delete success
      return Promise.resolve([{
        rowsAffected: 1,
        rows: { length: 0, item: () => null, raw: () => [] },
      }]);
    }
    
    if (sql.includes('SELECT')) {
      // Mock select - return empty by default
      return Promise.resolve([{
        rows: {
          length: 0,
          item: (index) => null,
          raw: () => [],
        },
      }]);
    }
    
    // Default response
    return Promise.resolve([{
      rows: {
        length: 0,
        item: () => null,
        raw: () => [],
      },
    }]);
  }),
  transaction: jest.fn((callback) => {
    const tx = {
      executeSql: mockDatabase.executeSql,
    };
    callback(tx);
    return Promise.resolve();
  }),
  close: jest.fn(() => Promise.resolve()),
};

export default {
  openDatabase: jest.fn(() => mockDatabase),
  enablePromise: jest.fn(),
  DEBUG: jest.fn(),
};
