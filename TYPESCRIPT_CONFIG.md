# TypeScript Configuration

This document describes the TypeScript and code quality configuration for the To Do: More app.

## TypeScript Configuration (tsconfig.json)

### Compiler Options

#### Target & Library
- **target**: ES2020 - Modern JavaScript features
- **lib**: ES2020 - Includes all ES2020 type definitions

#### Module System
- **module**: ESNext - Modern module syntax
- **moduleResolution**: bundler - Uses bundler-style module resolution
- **skipLibCheck**: true - Skip type checking of declaration files

#### Type Checking (Strict Mode Enabled)
- **strict**: true - Enables all strict type checking options
- **noUnusedLocals**: true - Error on unused local variables
- **noUnusedParameters**: true - Error on unused function parameters
- **noImplicitReturns**: true - Error when function doesn't return all code paths
- **noFallthroughCasesInSwitch**: true - Error on unhandled switch cases
- **noImplicitAny**: true - Error on implicit any types
- **strictNullChecks**: true - Strict null/undefined checking
- **strictFunctionTypes**: true - Strict function type compatibility
- **strictBindCallApply**: true - Strict bind/call/apply methods
- **strictPropertyInitialization**: true - Require class properties initialization
- **noImplicitThis**: true - Error on implicit this with any type
- **alwaysStrict**: true - Parse in strict mode

#### Path Mapping (Aliases)
The following path aliases are configured for cleaner imports:

```typescript
// Instead of: import { MyComponent } from '../../../components/MyComponent'
// Use:        import { MyComponent } from '@components/MyComponent'

@components/*  → src/components/*
@screens/*     → src/screens/*
@navigation/*  → src/navigation/*
@redux/*       → src/redux/*
@services/*    → src/services/*
@types/*       → src/types/*
@utils/*       → src/utils/*
@constants/*   → src/constants/*
@assets/*      → src/assets/*
```

## ESLint Configuration (.eslintrc.js)

### Rules

#### Code Quality
- `no-console`: Warn (allows console.warn and console.error)
- `no-var`: Error (use const/let instead)
- `prefer-const`: Error (prefer const over let)
- `prefer-arrow-callback`: Warn (prefer arrow functions)
- `eqeqeq`: Error (require === instead of ==)
- `no-eval`: Error (forbid eval)
- `no-implied-eval`: Error (forbid implied eval)
- `no-new-func`: Error (forbid Function constructor)

#### React Native Specific
- `react/react-in-jsx-scope`: Off (React 18+ doesn't require it)
- `react/prop-types`: Off (using TypeScript for prop validation)
- `react-native/no-unused-styles`: Warn
- `react-native/split-platform-components`: Warn

## Prettier Configuration (.prettierrc.js)

### Formatting Rules
- **singleQuote**: true - Use single quotes
- **jsxSingleQuote**: true - Use single quotes in JSX
- **printWidth**: 100 - Line length limit
- **tabWidth**: 2 - Two spaces per indentation
- **useTabs**: false - Use spaces instead of tabs
- **trailingComma**: all - Add trailing commas
- **semi**: true - Add semicolons
- **arrowParens**: avoid - Omit parentheses for single arrow params
- **bracketSpacing**: true - Add spaces inside braces
- **endOfLine**: auto - Detect line endings

## Running Code Quality Tools

### Lint Check
```bash
npm run lint
```

### TypeScript Type Check
```bash
npx tsc --noEmit
```

### Format Code
```bash
npx prettier --write .
```

### Fix Linting Issues
```bash
npm run lint -- --fix
```

## Type Definitions

Core types are defined in `src/types/index.ts`:

- **Task** - Todo item with properties
- **Goal** - SMART goal with progress tracking
- **User** - User account information
- **Streak** - Daily streak tracking
- **Enums** - TaskStatus, GoalStatus, Priority

Helper types in `src/types/helpers.ts`:
- Generic utility types for common patterns
- Validation types
- Callback types

## Best Practices

1. **Always use type annotations** for function parameters and return types
2. **Use const/let** instead of var
3. **Avoid any types** - use specific types instead
4. **Use path aliases** for cleaner imports
5. **Export types separately** - keep type files in src/types/
6. **Run lint before commits** - maintain code quality
7. **Use strict mode** - leverage TypeScript's type safety

## IDE Setup

Make sure your IDE is configured to:
1. Use the project's TypeScript version (in node_modules)
2. Use ESLint for linting
3. Use Prettier for formatting
4. Enable TypeScript strict mode
