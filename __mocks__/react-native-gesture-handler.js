// Mock for react-native-gesture-handler

const React = require('react');

module.exports = {
  GestureHandlerRootView: ({ children }) => children,
  State: {},
  PanGestureHandler: 'PanGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
  LongPressGestureHandler: 'LongPressGestureHandler',
  Swipeable: 'Swipeable',
  DrawerLayout: 'DrawerLayout',
  FlatList: 'FlatList',
  gestureHandlerRootHOC: jest.fn((Component) => Component),
  Directions: {},
};
