# Dependencies Configuration

This document outlines all the installed dependencies and their configurations for the To Do: More app.

## Installed Dependencies

### Core Navigation
- **@react-navigation/native** (^7.1.18) - Core navigation library
- **@react-navigation/bottom-tabs** (^7.5.0) - Bottom tab navigator
- **@react-navigation/stack** (^7.5.0) - Stack navigator
- **react-native-screens** (^4.18.0) - Native screen optimization
- **react-native-gesture-handler** (^2.29.0) - Touch gesture handling
- **react-native-safe-area-context** (^5.5.2) - Safe area insets

### State Management
- **@reduxjs/toolkit** (^2.9.2) - Redux state management with modern API
- **react-redux** (^9.2.0) - React bindings for Redux

### Database
- **react-native-sqlite-storage** (^6.0.1) - SQLite database for local storage

### UI Components
- **@rneui/themed** (^4.0.0-rc.7) - React Native Elements UI library
- **@rneui/base** (^4.0.0-rc.7) - Base components for React Native Elements
- **react-native-vector-icons** (^10.3.0) - Icon library

### Security
- **react-native-keychain** (^10.0.0) - Secure credential storage

### Utilities
- **date-fns** (^4.1.0) - Date manipulation and formatting

### Development Dependencies
- **@types/react-native-vector-icons** (^6.4.18) - TypeScript types for icons

## Configuration Files

### 1. react-native.config.js
Configures asset linking for custom fonts and vector icons.

```javascript
module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
};
```

### 2. Android Configuration

#### android/app/build.gradle
Added vector icons font configuration:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

#### MainActivity.kt
Added gesture handler configuration:
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(null)
}
```

### 3. App.tsx
Added gesture handler import at the top:
```typescript
import 'react-native-gesture-handler';
```

## Post-Installation Steps

### For Android Development

1. **Link native modules** (Auto-linking is enabled in React Native 0.60+)
   ```bash
   cd android
   ./gradlew clean
   ```

2. **Rebuild the app**
   ```bash
   npm run android
   ```

### Required for Production

1. **SQLite** - Already configured for autolinking
2. **Keychain** - Requires Android Keystore setup (will configure in authentication phase)
3. **Vector Icons** - Font files automatically linked

## Known Issues & Solutions

### Issue: Peer Dependency Conflicts
**Solution**: Used `--legacy-peer-deps` flag for installations due to version mismatches between dependencies.

### Issue: React Native Safe Area Context Version
**Solution**: Downgraded @rneui packages to 4.0.0-rc.7 to match safe-area-context requirements.

## Next Steps

- Configure TypeScript definitions (Step 1.3)
- Set up ESLint and Prettier rules
- Create type definitions for core models
