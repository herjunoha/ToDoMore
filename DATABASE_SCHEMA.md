# Database Schema Design

This document outlines the database schema for the To Do: More application using SQLite.

## Overview

The application uses SQLite for local data storage with the following tables:
- Users - User account information
- Goals - SMART goals with progress tracking
- Tasks - Todo items that can be linked to goals
- Streaks - Daily streak tracking

## Database Configuration

- **Database Name**: `todomore.db`
- **Version**: 1
- **Encryption**: None (potential for SQLCipher in future)

## Tables

### 1. Users Table

Stores user account information for local authentication.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Columns:**
- `id` (TEXT, PRIMARY KEY) - Unique identifier (UUID)
- `username` (TEXT, UNIQUE, NOT NULL) - User's chosen username
- `pin_hash` (TEXT, NOT NULL) - Hashed PIN for authentication
- `created_at` (TEXT, NOT NULL) - Account creation timestamp (ISO 8601)
- `updated_at` (TEXT, NOT NULL) - Last update timestamp (ISO 8601)

**Indexes:**
- Primary Key: `id`
- Unique Index: `username`

### 2. Goals Table

Stores SMART goals with progress tracking capabilities.

```sql
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  specific TEXT NOT NULL,
  measurable TEXT NOT NULL,
  achievable TEXT NOT NULL,
  relevant TEXT NOT NULL,
  time_bound TEXT NOT NULL,
  title TEXT,
  description TEXT,
  status TEXT NOT NULL,
  progress REAL DEFAULT 0,
  parent_goal_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_goal_id) REFERENCES goals(id) ON DELETE CASCADE
);
```

**Columns:**
- `id` (TEXT, PRIMARY KEY) - Unique identifier (UUID)
- `user_id` (TEXT, NOT NULL) - Reference to user who owns this goal
- `specific` (TEXT, NOT NULL) - Clear definition of the goal
- `measurable` (TEXT, NOT NULL) - How progress will be measured
- `achievable` (TEXT, NOT NULL) - Confirmation or notes on achievability
- `relevant` (TEXT, NOT NULL) - Why this goal is important
- `time_bound` (TEXT, NOT NULL) - Deadline for the goal (ISO 8601 date)
- `title` (TEXT) - Auto-generated or user-defined title
- `description` (TEXT) - Additional details about the goal
- `status` (TEXT, NOT NULL) - Current status (not_started, in_progress, achieved, failed)
- `progress` (REAL, DEFAULT 0) - Calculated progress percentage (0-100)
- `parent_goal_id` (TEXT) - Reference to parent goal for sub-goals
- `created_at` (TEXT, NOT NULL) - Creation timestamp (ISO 8601)
- `updated_at` (TEXT, NOT NULL) - Last update timestamp (ISO 8601)

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id`
- Foreign Key: `parent_goal_id`
- Index: `status`

### 3. Tasks Table

Stores todo items that can be linked to goals.

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT,
  status TEXT NOT NULL,
  parent_task_id TEXT,
  goal_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);
```

**Columns:**
- `id` (TEXT, PRIMARY KEY) - Unique identifier (UUID)
- `user_id` (TEXT, NOT NULL) - Reference to user who owns this task
- `title` (TEXT, NOT NULL) - Task title
- `description` (TEXT) - Detailed description
- `due_date` (TEXT) - Due date for the task (ISO 8601)
- `priority` (TEXT) - Priority level (low, medium, high)
- `status` (TEXT, NOT NULL) - Current status (pending, in_progress, completed)
- `parent_task_id` (TEXT) - Reference to parent task for subtasks
- `goal_id` (TEXT) - Reference to associated goal
- `created_at` (TEXT, NOT NULL) - Creation timestamp (ISO 8601)
- `updated_at` (TEXT, NOT NULL) - Last update timestamp (ISO 8601)

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id`
- Foreign Key: `parent_task_id`
- Foreign Key: `goal_id`
- Index: `status`
- Index: `priority`

### 4. Streaks Table

Tracks daily streaks for task completion.

```sql
CREATE TABLE streaks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Columns:**
- `id` (TEXT, PRIMARY KEY) - Unique identifier (UUID)
- `user_id` (TEXT, NOT NULL, UNIQUE) - Reference to user (one streak per user)
- `current_streak` (INTEGER, NOT NULL, DEFAULT 0) - Current consecutive days
- `longest_streak` (INTEGER, NOT NULL, DEFAULT 0) - Longest consecutive days
- `last_completed_date` (TEXT) - Last date a task was completed (ISO 8601)
- `created_at` (TEXT, NOT NULL) - Creation timestamp (ISO 8601)
- `updated_at` (TEXT, NOT NULL) - Last update timestamp (ISO 8601)

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` (UNIQUE)
- Index: `current_streak`

## Relationships

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ GOALS : owns
    USERS ||--o{ TASKS : owns
    USERS ||--|| STREAKS : has
    GOALS ||--o{ TASKS : contains
    GOALS ||--o{ GOALS : subgoals
    TASKS ||--o{ TASKS : subtasks

    USERS {
        TEXT id PK
        TEXT username UK
        TEXT pin_hash
        TEXT created_at
        TEXT updated_at
    }

    GOALS {
        TEXT id PK
        TEXT user_id FK
        TEXT specific
        TEXT measurable
        TEXT achievable
        TEXT relevant
        TEXT time_bound
        TEXT title
        TEXT description
        TEXT status
        REAL progress
        TEXT parent_goal_id FK
        TEXT created_at
        TEXT updated_at
    }

    TASKS {
        TEXT id PK
        TEXT user_id FK
        TEXT title
        TEXT description
        TEXT due_date
        TEXT priority
        TEXT status
        TEXT parent_task_id FK
        TEXT goal_id FK
        TEXT created_at
        TEXT updated_at
    }

    STREAKS {
        TEXT id PK
        TEXT user_id FK UK
        INTEGER current_streak
        INTEGER longest_streak
        TEXT last_completed_date
        TEXT created_at
        TEXT updated_at
    }
```

## Data Types Mapping

| SQLite Type | JavaScript/TypeScript | Description |
|-------------|----------------------|-------------|
| TEXT | string | Strings, UUIDs, dates (ISO 8601) |
| INTEGER | number | Numbers, booleans (0/1) |
| REAL | number | Floating point numbers |
| BLOB | Uint8Array | Binary data (not used in current schema) |

## Indexes

All primary keys automatically create indexes. Additional indexes for performance:

1. `users(username)` - UNIQUE index for fast username lookups
2. `goals(user_id)` - Index for user's goals
3. `goals(status)` - Index for filtering goals by status
4. `tasks(user_id)` - Index for user's tasks
5. `tasks(status)` - Index for filtering tasks by status
6. `tasks(priority)` - Index for sorting tasks by priority
7. `tasks(goal_id)` - Index for tasks linked to goals
8. `streaks(user_id)` - UNIQUE index for user's streak

## Constraints

### Foreign Key Constraints
- All references use `ON DELETE CASCADE` except for goal_id in tasks which uses `ON DELETE SET NULL`
- This ensures data integrity while allowing flexible task-goal relationships

### Check Constraints
- Status fields have predefined values:
  - Task status: 'pending', 'in_progress', 'completed'
  - Goal status: 'not_started', 'in_progress', 'achieved', 'failed'
  - Priority: 'low', 'medium', 'high'

## Migration Strategy

### Version 1 Schema
This is the initial schema for version 1 of the database.

### Future Versions
When updating the schema:
1. Increment database version in [constants](file://d:\#1%20PENTING\Hackaton%2025-26%20Oct\Qoder_ToDoMore\ToDoMore\src\constants\index.ts)
2. Add migration scripts in `src/services/database/migrations/`
3. Update table creation SQL in database service
4. Test migration with existing data

## Security Considerations

1. **PIN Storage**: PINs are hashed before storage (not plain text)
2. **Data Isolation**: Each user's data is isolated by user_id
3. **No Sensitive Data**: No personally identifiable information beyond username
4. **Local Storage**: All data stored locally on device

## Performance Considerations

1. **Indexes**: Properly indexed for common query patterns
2. **Cascading Deletes**: Efficient cleanup of related data
3. **Normalized Design**: Reduces data duplication while maintaining relationships
4. **Date Storage**: Using ISO 8601 strings for easy sorting and querying

## Sample Queries

### User Authentication
```sql
SELECT id, username FROM users WHERE username = ? AND pin_hash = ?
```

### Get User's Goals
```sql
SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC
```

### Get Goal with Progress
```sql
SELECT g.*, 
       (SELECT COUNT(*) FROM tasks WHERE goal_id = g.id AND status = 'completed') as completed_tasks,
       (SELECT COUNT(*) FROM tasks WHERE goal_id = g.id) as total_tasks
FROM goals g 
WHERE g.id = ?
```

### Get User's Tasks
```sql
SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC
```

### Update Streak
```sql
UPDATE streaks 
SET current_streak = ?, 
    longest_streak = MAX(longest_streak, ?),
    last_completed_date = ?,
    updated_at = ?
WHERE user_id = ?
```
