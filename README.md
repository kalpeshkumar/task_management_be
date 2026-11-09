# Student Task Management Backend

A production-ready Task and Project Management REST API built with Node.js, Express, PostgreSQL, and Drizzle ORM following a strict layered architecture (Routes → Controllers → Services → Repositories → Models).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation and Setup](#installation-and-setup)
5. [Environment Variables](#environment-variables)
6. [Database and Seeding](#database-and-seeding)
7. [Running the Server](#running-the-server)
8. [Authentication Flow](#authentication-flow)
9. [API Overview](#api-overview)
   - [Health Check](#health-check)
   - [Auth Module](#auth-module)
   - [User Module](#user-module)
   - [Project Module](#project-module)
   - [Task Module](#task-module)
10. [API Documentation (Swagger)](#api-documentation-swagger)
11. [Response and Error Format](#response-and-error-format)
12. [Folder Structure](#folder-structure)
13. [Scripts](#scripts)
14. [Code Conventions](#code-conventions)
15. [License](#license)

---

## Tech Stack

| Component | Technology | Version | Description |
|---|---|---|---|
| **Runtime** | Node.js | v18+ / v20+ / v24+ | Server-side JavaScript runtime |
| **Framework** | Express | ^4.22.3 | Minimalist web application framework |
| **Database** | PostgreSQL | 14+ | Relational SQL database engine |
| **ORM** | Drizzle ORM | ^0.45.4 | TypeScript/JavaScript SQL ORM |
| **Database Driver** | `pg` (node-postgres) | ^8.13.1 | PostgreSQL client connection pooling |
| **Migrations** | Drizzle Kit | ^0.31.11 | Drizzle database migration and schema CLI |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | ^9.0.2 | Stateless access & refresh tokens |
| **Password Hashing** | `bcrypt` / `bcryptjs` | ^6.0.0 / ^2.4.3 | Salted password cryptographic hashing |
| **Validation** | Zod | ^4.6.7 | TypeScript-first schema validation |
| **API Docs** | Swagger UI (`swagger-ui-express`) | ^5.0.1 | Interactive OpenAPI 3.0 UI |
| **Spec Generator** | `swagger-jsdoc` / `js-yaml` | ^6.3.0 / ^5.5.0 | OpenAPI YAML specification loader |
| **HTTP Statuses** | `http-status-codes` | ^2.3.0 | Standardized HTTP status codes |
| **CORS** | `cors` | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| **Environment** | `dotenv` | ^16.4.7 | Dotenv environment variable loader |
| **Dev Monitor** | `nodemon` | ^3.1.9 | File watcher and live server reload |

---

## Features

- **Layered Architecture**: Strict separation of concerns between HTTP routing, controllers, business services, data repositories, database models, and validation schemas.
- **Enterprise Authentication & RBAC**:
  - Dual JWT token mechanism: short-lived access token (`24h`) and long-lived refresh token (`7d`).
  - First-login password activation with 48-hour cryptographically secure SHA-256 setup tokens.
  - Role-Based Access Control supporting `ADMIN` and `USER` roles.
  - Token invalidation on user logout and password change.
- **Standardized 6-Endpoint CRUD & Filter Structure**:
  - Consistent endpoints across User, Task, and Project modules (`/add`, `/:id`, `GET /:id`, `DELETE /:id`, `/filter`, `/filter/paginated`).
  - Multi-column dynamic filtering (IDs, search queries, date ranges) with custom column sorting (`ASC` / `DESC`).
- **Interactive OpenAPI 3.0 Documentation**: Fully documented schemas and paths mounted at `/api-docs` and `/swagger-ui`.
- **Zod Schema Validation**: Strict input sanitization with password complexity rules and cross-field confirmation verification.
- **Predictable Response Envelope**: Unified JSON envelope for single-entity, paginated, and error responses.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (tested with `v24.21.0`).
- **npm**: `v9.0.0` or higher.
- **PostgreSQL**: `v14` or higher running locally or accessible remotely.

---

## Installation and Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure your PostgreSQL database credentials and JWT secret keys.

4. **Initialize database schema**:
   Ensure PostgreSQL is running and the database specified in `DB_NAME` exists:
   ```bash
   psql -U postgres -c "CREATE DATABASE task_management;"
   node scripts/setup-db.js
   ```

5. **Seed initial administrator account**:
   ```bash
   npm run seed
   ```

---

## Environment Variables

All environment variables are loaded via `dotenv`. Configure them in `.env`:

| Name | Description | Example / Default | Required |
|---|---|---|---|
| `PORT` | HTTP port the Express server listens on | `5000` | No (default: 5000) |
| `HOST_NAME` | Base URL of the backend server (used for Swagger and logs) | `http://localhost:5000` | No (default: `http://localhost:5000`) |
| `NODE_ENV` | Application runtime environment (`development` / `production`) | `development` | No (default: `development`) |
| `API_PREFIX` | Prefix for API routes | `/api/v1` | No |
| `CORS_ORIGIN` | Allowed CORS origins (`*` or comma-separated origins) | `*` | No (default: `*`) |
| `TIME_ZONE` | Default timezone for time operations | `Asia/Kolkata` | No |
| `DB_URL` | Full PostgreSQL connection URL | `postgresql://postgres:123@localhost:5432/task_management` | Yes |
| `DB_HOST` | PostgreSQL host | `localhost` | No |
| `DB_PORT` | PostgreSQL port | `5432` | No (default: 5432) |
| `DB_USER` | PostgreSQL user | `postgres` | No |
| `DB_PASSWORD` | PostgreSQL user password | `your_db_password` | No |
| `DB_NAME` | PostgreSQL database name | `task_management` | No |
| `JWT_SECRET` | Secret key for signing JWT access tokens | `your_long_random_jwt_access_secret` | Yes |
| `JWT_EXPIRES_IN` | Access token lifespan | `24h` | No (default: `24h`) |
| `JWT_REFRESH_SECRET` | Secret key for signing JWT refresh tokens | `your_long_random_jwt_refresh_secret` | Yes |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token lifespan | `7d` | No (default: `7d`) |
| `BCRYPT_SALT_ROUNDS` | Salt rounds for bcrypt password hashing | `12` | No (default: `12`) |
| `DEFAULT_PAGE` | Default page index for paginated queries | `1` | No (default: 1) |
| `DEFAULT_LIMIT` | Default item limit for paginated queries | `10` | No (default: 10) |
| `MAX_LIMIT` | Maximum allowed item limit for paginated queries | `100` | No (default: 100) |
| `LOG_LEVEL` | Logging verbosity (`debug`, `info`, `warn`, `error`) | `debug` | No (default: `debug`) |
| `ADMIN_NAME` | Seed admin account full name | `System Administrator` | No (default: `System Administrator`) |
| `ADMIN_EMAIL` | Seed admin account email address | `admin@example.com` | No (default: `admin@example.com`) |
| `ADMIN_PASSWORD` | Seed admin account initial password | `Admin@12345` | No (default: `Admin@12345`) |

---

## Database and Seeding

### Schema Initialization
Run `node scripts/setup-db.js` to ensure the custom `user_role` PostgreSQL enum type (`ADMIN`, `USER`) and all required relational tables (`users`, `projects`, `tasks`) exist:
```bash
node scripts/setup-db.js
```

### Initial Admin Seeder
Run the idempotent seed script to create the initial administrator:
```bash
npm run seed
```

**What it creates**:
- Reads `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env`.
- Hashes the password using `bcrypt` (10 rounds).
- Creates an active user record with `role: ADMIN`, `isPasswordSet: true`, and `isActive: true`.

**Idempotency Guarantee**:
If a user with `ADMIN_EMAIL` already exists, the script logs:
```
Admin already exists: admin@example.com. Skipping seed.
```
and exits cleanly with code `0` without duplicating or overwriting data. It is safe to run multiple times.

---

## Running the Server

### Development Mode (with hot-reload via nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once started, the server listens at `http://localhost:5000` (or your configured `PORT`).

---

## Authentication Flow

The system enforces a secure first-login password activation flow:

```
[ Admin ]                                            [ New User ]
    │                                                     │
    ▼                                                     │
POST /api/users/add                                       │
Body: { name, email, role }                               │
(NO password passed)                                      │
    │                                                     │
    ├─────────────────────────────────────────┐           │
    │ 1. User created:                        │           │
    │    password = null                      │           │
    │    isPasswordSet = false                │           │
    │    passwordSetupToken = SHA256(rawToken)│           │
    │    passwordSetupExpires = NOW + 48h     │           │
    ▼                                         ▼           │
Returns raw setupToken                   User attempts    │
(share setup link with user)             POST /api/auth/login
                                              │           │
                                              ▼           │
                                         HTTP 403 FORBIDDEN
                                         "PASSWORD_NOT_SET"
                                              │           │
                                              ▼           │
                                         User opens setup link:
                                         POST /api/auth/set-password
                                         { token, newPassword, confirmPassword }
                                              │
                                              ▼
                                         Token verified, password hashed,
                                         isPasswordSet = true,
                                         setup token cleared.
                                              │
                                              ▼
                                         Returns HTTP 200 with
                                         Access & Refresh Tokens!
```

### 1. Admin Adds a User (No Password)
**Request**:
```http
POST /api/users/add HTTP/1.1
Host: localhost:5000
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "name": "Jane Employee",
  "email": "jane@example.com",
  "role": "USER"
}
```

**Response (200 OK)**:
```json
{
  "data": {
    "id": 2,
    "name": "Jane Employee",
    "email": "jane@example.com",
    "role": "USER",
    "isPasswordSet": false,
    "isActive": true,
    "setupToken": "4d9f67a21f729b82736183e8fa56210f9a8b7c6d5e4f3a2b1c0d",
    "setupExpires": "2026-11-11T09:00:00.000Z",
    "createdAt": "2026-11-09T09:00:00.000Z",
    "updatedAt": "2026-11-09T09:00:00.000Z"
  },
  "status": {
    "statusCode": 200,
    "status": "SUCCESS",
    "message": "User created successfully"
  }
}
```

### 2. User Attempts Login Before Password Setup
**Request**:
```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "AnyPassword@123"
}
```

**Response (403 Forbidden)**:
```json
{
  "data": null,
  "status": {
    "statusCode": 403,
    "status": "ERROR",
    "message": "PASSWORD_NOT_SET: Password is not set. Please use your setup link to set your password."
  }
}
```

### 3. User Sets Password (Public)
**Request**:
```http
POST /api/auth/set-password HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "token": "4d9f67a21f729b82736183e8fa56210f9a8b7c6d5e4f3a2b1c0d",
  "newPassword": "SecurePassword@123",
  "confirmPassword": "SecurePassword@123"
}
```

**Response (200 OK)**:
```json
{
  "data": {
    "message": "Password set successfully. You can now log in.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "name": "Jane Employee",
      "email": "jane@example.com",
      "role": "USER",
      "isPasswordSet": true,
      "isActive": true
    }
  },
  "status": {
    "statusCode": 200,
    "status": "SUCCESS",
    "message": "Password set successfully. You can now log in."
  }
}
```

### 4. Changing Password Later (Protected)
**Request**:
```http
POST /api/auth/change-password HTTP/1.1
Host: localhost:5000
Authorization: Bearer <user_access_token>
Content-Type: application/json

{
  "currentPassword": "SecurePassword@123",
  "newPassword": "UpdatedPassword@456",
  "confirmPassword": "UpdatedPassword@456"
}
```

**Response (200 OK)**:
```json
{
  "data": null,
  "status": {
    "statusCode": 200,
    "status": "SUCCESS",
    "message": "Password changed successfully"
  }
}
```

---

## API Overview

### Health Check

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/health` | Public | Any | Server health status check |

---

### Auth Module

Base Path: `/api/auth`

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Any | Authenticate email & password; returns access & refresh tokens. Returns 403 if password not set or account inactive |
| `POST` | `/api/auth/set-password` | Public | Any | First-login initial password setup using one-time 48h setup token |
| `POST` | `/api/auth/refresh-token` | Public | Any | Exchange refresh token for a fresh access token and refresh token |
| `POST` | `/api/auth/forgot-password`| Public | Any | Request password reset email / token |
| `POST` | `/api/auth/reset-password` | Public | Any | Reset password using valid reset token |
| `GET` | `/api/auth/me` | `verifyToken` | Any | Retrieve profile of the currently logged-in user |
| `POST` | `/api/auth/logout` | `verifyToken` | Any | Invalidate current user's refresh token and clear session |
| `POST` | `/api/auth/change-password`| `verifyToken` | Any | Change password with current password verification |

---

### User Module

Base Path: `/api/users` (also aliased at `/api/user`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/users/add` | `verifyToken` | `ADMIN` | Create user (password=null); returns 48h setup token |
| `POST` | `/api/users/:userId/resend-setup-token` | `verifyToken` | `ADMIN` | Regenerate 48h setup token for a pending user |
| `PUT` | `/api/users/:userId` | `verifyToken` | `ADMIN` | Update user profile details |
| `GET` | `/api/users/:userId` | `verifyToken` | `ADMIN` | Retrieve user details by numeric ID |
| `DELETE`| `/api/users/:userId` | `verifyToken` | `ADMIN` | Delete user record by numeric ID |
| `POST` | `/api/users/filter` | `verifyToken` | `ADMIN` | Filter users with search, roles, date ranges, and sorting |
| `POST` | `/api/users/filter/paginated` | `verifyToken` | `ADMIN` | Filter users with pagination metadata and sorting |

---

### Project Module

Base Path: `/api/projects` (also aliased at `/api/project`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/projects/add` | `verifyToken` | `ADMIN` | Create a new project |
| `PUT` | `/api/projects/:projectId` | `verifyToken` | `ADMIN` | Update project details by numeric ID |
| `GET` | `/api/projects/:projectId` | `verifyToken` | `ADMIN` | Retrieve project details by numeric ID |
| `DELETE`| `/api/projects/:projectId` | `verifyToken` | `ADMIN` | Delete project record by numeric ID |
| `POST` | `/api/projects/filter` | `verifyToken` | `ADMIN` | Filter projects with search, date ranges, and sorting |
| `POST` | `/api/projects/filter/paginated` | `verifyToken` | `ADMIN` | Filter projects with pagination metadata and sorting |
| `GET` | `/api/projects/` | `verifyToken` | Any | List all projects (frontend compatibility) |

---

### Task Module

Base Path: `/api/tasks` (also aliased at `/api/task`)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/tasks/add` | `verifyToken` | `ADMIN` | Create a new task assigned to project and user |
| `PUT` | `/api/tasks/:taskId` | `verifyToken` | `ADMIN` | Update existing task details by numeric ID |
| `GET` | `/api/tasks/:taskId` | `verifyToken` | `ADMIN` | Retrieve task details by numeric ID |
| `DELETE`| `/api/tasks/:taskId` | `verifyToken` | `ADMIN` | Delete task by numeric ID |
| `POST` | `/api/tasks/filter` | `verifyToken` | `ADMIN` | Filter tasks by project, assignee, status, due date, with sorting |
| `POST` | `/api/tasks/filter/paginated` | `verifyToken` | `ADMIN` | Filter tasks with pagination metadata and sorting |
| `GET` | `/api/tasks/` | `verifyToken` | Any | List all tasks with optional query filters (frontend compatibility) |
| `GET` | `/api/tasks/stats` | `verifyToken` | Any | Retrieve task summary counts grouped by status (`Todo`, `In Progress`, `Completed`) |
| `POST` | `/api/tasks/` | `verifyToken` | Any | Create quick task with auto-assigned `createdBy` |
| `PATCH` | `/api/tasks/:id/status` | `verifyToken` | Any | Update task status (`Todo`, `In Progress`, `Completed`) |

---

## API Documentation (Swagger)

Interactive Swagger UI is accessible at:
- **Swagger UI**: [`http://localhost:5000/api-docs`](http://localhost:5000/api-docs) or [`http://localhost:5000/swagger-ui`](http://localhost:5000/swagger-ui)
- **OpenAPI JSON Spec**: [`http://localhost:5000/api-docs/swagger.json`](http://localhost:5000/api-docs/swagger.json)

### How to use the Authorize Button
1. Call `POST /api/auth/login` with your administrator or user credentials.
2. Copy the `token` or `accessToken` value from the response `data`.
3. In Swagger UI, click the green **Authorize** button in the top right.
4. In the dialog, enter:
   ```
   Bearer <your_access_token>
   ```
5. Click **Authorize** and then **Close**. All subsequent requests in Swagger UI will now include the Bearer token in the `Authorization` header.

---

## Response and Error Format

All responses follow a consistent JSON structure.

### 1. Standard Success Response
```json
{
  "data": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@example.com",
    "role": "ADMIN",
    "isPasswordSet": true,
    "isActive": true,
    "createdAt": "2026-11-09T08:00:00.000Z",
    "updatedAt": "2026-11-09T08:00:00.000Z"
  },
  "status": {
    "statusCode": 200,
    "status": "SUCCESS",
    "message": "Success"
  }
}
```

### 2. Paginated Success Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Backend Redesign",
      "description": "Refactor backend to clean layered architecture"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalRecords": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  },
  "sort": {
    "sort": "created_at",
    "sortBy": "DESC"
  },
  "status": {
    "statusCode": 200,
    "status": "SUCCESS",
    "message": "Success"
  }
}
```

### 3. Error Response
In case of errors, `data` is `null` and `status` provides the error details:
```json
{
  "data": null,
  "status": {
    "statusCode": 403,
    "status": "ERROR",
    "message": "PASSWORD_NOT_SET: Password is not set. Please use your setup link to set your password."
  }
}
```

Common Error Codes:
- `400 Bad Request`: Input validation failed, password mismatch, or invalid/expired token.
- `401 Unauthorized`: Invalid credentials, expired session, or missing Bearer token.
- `403 Forbidden`: `PASSWORD_NOT_SET`, `ACCOUNT_INACTIVE`, or insufficient role permissions (`requireRole`).
- `404 Not Found`: Requested user, project, or task does not exist.
- `409 Conflict`: User with email already exists.
- `500 Internal Server Error`: Unhandled server exception.

---

## Folder Structure

```
backend/
├── drizzle.config.js          # Drizzle Kit CLI database dialect and connection configuration
├── package.json               # Backend dependencies, metadata, and npm scripts
├── scripts/                   # Standalone database and verification scripts
│   ├── seed.js                # Initial administrator user idempotent seeder
│   ├── setup-db.js            # PostgreSQL enum type and schema initialization script
│   └── verify-flow.js         # 15-point automated end-to-end integration test runner
└── src/                       # Application source code
    ├── api-docs/              # Modular OpenAPI 3.0 YAML specifications
    │   ├── index.swagger.yaml # Base Swagger config and shared schemas
    │   ├── auth.swagger.yaml  # Authentication endpoint schemas
    │   ├── user.swagger.yaml  # User endpoint schemas
    │   ├── project.swagger.yaml # Project endpoint schemas
    │   └── task.swagger.yaml  # Task endpoint schemas
    ├── configs/               # Global configuration modules
    │   ├── cors.config.js     # CORS origin headers and preflight handling
    │   ├── db.config.js       # PostgreSQL Pool connection and Drizzle ORM client instance
    │   ├── error.config.js    # Custom AppError hierarchy and global exception handler
    │   └── swagger.config.js  # Swagger-jsdoc and Swagger UI setup
    ├── constants/             # Constant definitions
    │   ├── error.constant.js  # Standardized error message strings
    │   └── message.constant.js # Standardized success message strings
    ├── controllers/           # Controller layer: extracts parameters and delegates to services
    │   ├── auth.controller.js # Auth actions: login, setup, change password, refresh
    │   ├── project.controller.js # Project actions: CRUD, filters, pagination
    │   ├── task.controller.js # Task actions: CRUD, filters, status, stats
    │   └── user.controller.js # User actions: CRUD, filters, resend setup token
    ├── enums/                 # Application enums
    │   ├── role.enum.js       # User roles: ADMIN, USER
    │   └── sort.enum.js       # Sorting directions: ASC, DESC
    ├── middleware/            # Express request interceptors
    │   └── auth.middleware.js # verifyToken, requireRole, allowRole
    ├── models/                # Drizzle ORM PostgreSQL table schemas
    │   ├── project.model.js   # projects table
    │   ├── task.model.js      # tasks table
    │   └── user.model.js      # users table
    ├── repositories/          # Data Access Layer: dynamic SQL queries, filters, pagination
    │   ├── project.repository.js # Project queries
    │   ├── task.repository.js # Task queries and stats
    │   └── user.repository.js # User queries, credentials, and token management
    ├── routes/                # Express router definitions
    │   ├── index.route.js     # Master router registering all modules under /api
    │   ├── auth.route.js      # Auth route declarations
    │   ├── project.route.js   # Project route declarations
    │   ├── task.route.js      # Task route declarations
    │   └── user.route.js      # User route declarations
    ├── services/              # Business logic layer: validation, hashing, orchestration
    │   ├── auth.service.js    # Auth business logic
    │   ├── project.service.js # Project business logic
    │   ├── task.service.js    # Task business logic
    │   └── user.service.js    # User setup token generation
    ├── utils/                 # Utility helpers
    │   ├── common.utils.js    # Type validation and password hashing helpers
    │   ├── jwt.utils.js       # JWT access & refresh token signing and verification
    │   ├── page.utils.js      # Pagination offsets and sort clause parsers
    │   └── response.utils.js  # Standardized JSON response builders
    ├── validation/            # Zod validation schemas
    │   ├── index.validation.js # Validation executor wrapper
    │   ├── auth.validation.js # Auth input schemas
    │   ├── project.validation.js # Project input schemas
    │   ├── task.validation.js # Task input schemas
    │   └── user.validation.js # User input schemas
    └── server.js              # Application entrypoint: registers middleware, swagger, routes, and error handler
```

---

## Scripts

All scripts are defined in `package.json` and executed via `npm run <script>`:

| Script | Command | Purpose |
|---|---|---|
| `start` | `node src/server.js` | Runs the server in standard production mode |
| `dev` | `nodemon src/server.js` | Runs the server with nodemon for live automatic reload on file changes |
| `seed` | `node scripts/seed.js` | Idempotent initial administrator account creation |
| `db:generate`| `drizzle-kit generate` | Generates SQL migrations from Drizzle schemas in `src/models/` |
| `db:migrate` | `drizzle-kit migrate` | Applies pending SQL migrations to the database |
| `db:push` | `drizzle-kit push` | Pushes current Drizzle schema directly to PostgreSQL |

---

## Code Conventions

The codebase adheres strictly to the following patterns:
- **Layered Architecture**: Controllers only extract parameters and format responses; services handle business logic and validation; repositories execute Drizzle SQL queries.
- **Symmetric CRUD Structure**: All main domain modules (`user`, `project`, `task`) expose the exact same 6 operations (`/add`, `/:id`, `GET /:id`, `DELETE /:id`, `/filter`, `/filter/paginated`).
- **Security-First Password Handling**: User passwords are excluded from `this.userSelection` projections in repositories, ensuring password hashes are never leaked in API responses.
- **Token Hashing**: Setup tokens and reset tokens are saved only as SHA-256 hashes in the database; raw tokens are only sent to the user upon creation.
- **Fail-Fast Schema Validation**: All incoming requests are validated against Zod schemas in `src/validation/` using `validSchema(...)` before service execution.
- **Custom Error Hierarchy**: Application exceptions extend `AppError` (`InvalidRequestException`, `UnauthorizedException`, `AccessDeniedException`, `NotFoundException`, `AlreadyExistsException`), which are mapped to consistent HTTP status codes by `errorHandler`.

---

## License

This project does not currently have an open-source license declared in `package.json`. All rights are reserved by the project owners.

