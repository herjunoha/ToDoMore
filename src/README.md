# Source Directory Structure

This directory contains all the application source code organized by feature and responsibility.

## Directory Overview

```
src/
├── assets/          # Static assets (images, fonts, icons)
│   ├── fonts/       # Custom fonts
│   └── images/      # Image files
├── components/      # Reusable UI components
│   └── common/      # Shared components across the app
├── constants/       # App-wide constants and configurations
├── navigation/      # Navigation configuration and navigators
├── redux/           # State management
│   ├── slices/      # Redux slices (tasks, goals, auth, streaks)
│   └── store/       # Redux store configuration
├── screens/         # Screen components
│   ├── auth/        # Authentication screens (Login, Register)
│   ├── dashboard/   # Dashboard screen
│   ├── goals/       # Goal management screens
│   └── tasks/       # Task management screens
├── services/        # Business logic and external services
│   ├── auth/        # Authentication service
│   └── database/    # Database service and DAOs
├── types/           # TypeScript type definitions and interfaces
└── utils/           # Utility functions and helpers
```

## Architecture Pattern

This app follows the **MVVM (Model-View-ViewModel)** architecture pattern:

- **Model**: Data models and database layer (`services/database`, `types`)
- **View**: React Native components (`screens`, `components`)
- **ViewModel**: Redux slices managing state and business logic (`redux`)

## Key Technologies

- **React Native** with TypeScript
- **Redux Toolkit** for state management
- **SQLite** for local data storage
- **React Navigation** for routing

## Development Guidelines

1. Keep components small and focused
2. Use TypeScript interfaces for all data structures
3. Follow the established folder structure
4. Place reusable logic in `utils`
5. Define all types in `types` directory
6. Use Redux for global state, local state for UI-only concerns
