# AGENTS.md - Developer Guidelines for Poster_Hub

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

---

## Build Commands

### Client (React + Vite)
```bash
cd client
npm run dev          # Start dev server (host accessible)
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Server (Express)
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm run start        # Production start
# No tests configured yet
```

### Running a Single Test
Tests are not currently set up. To add, run: `npm init jest` in server folder.

---

## Code Style Guidelines

### General
- Use JavaScript ES6+ features (const/let, arrow functions, async/await)
- No TypeScript in this project — use PropTypes or inline JSDoc for types
- Prefer functional components over class components in React

### React Client
- Use functional components with hooks (`useState`, `useEffect`, `useContext`)
- Component file naming: PascalCase (`UserProfile.jsx`)
- Custom hooks: prefix with `use` (`useAuth.js`)
- CSS: TailwindCSS classes preferred; avoid inline styles
- State: use Context API for global state, local state for component-specific

### Express Server
- Routes in `/server/src/routes/`
- Controllers in `/server/src/controllers/`
- Models in `/server/src/models/`
- Use async/await for async operations with try/catch blocks
- Return consistent JSON responses: `{ success: true, data: ... }` or `{ success: false, error: "message" }`

### Import Conventions
```javascript
// React - external first, then internal components, then utils
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Component from './Component';
import { helper } from '../utils';

// Server - same pattern
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { authMiddleware } from '../middleware';
```

### Naming
- Variables/functions: camelCase (`getUserData`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- Components/Classes: PascalCase (`Dashboard`, `UserController`)
- Files: kebab-case for utilities (`auth-helper.js`), PascalCase for components (`Button.jsx`)

### Error Handling
- React: Use Error Boundaries for component failures; display user-friendly messages
- Server: Always wrap async route handlers; return appropriate HTTP status codes (400, 401, 404, 500)
- Never expose stack traces to clients in production

### Git Conventions
- Branch naming: `feature/description` or `fix/description`
- Commit messages: imperative mood ("Add user auth" not "Added user auth")
- PRs: include description of changes and tested scenarios

### Project Structure
```
Poster_Hub/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   └── package.json
└── AGENTS.md
```