# Task Manager

A full-stack task management application with role-based access control, built with **React 19**, **Express 5**, and **PostgreSQL (Sequelize ORM)**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router DOM 7, Vite 8 |
| **Backend** | Express 5, Sequelize 6, PostgreSQL (Neon) |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **Validation** | Joi, express-validator |
| **Security** | Helmet, CORS, rate limiting, compression |

## Features

- **Authentication** – Register, login, JWT access/refresh tokens, secure logout
- **Role-Based Access** – Admin and regular user roles with middleware-protected routes
- **Task Management** – Create, read, update, delete tasks with status, priority, due dates, and assignment
- **Categories** – Create and manage task categories with color labels (many-to-many)
- **User Management** – Admin can list, filter, and deactivate users
- **Dashboard** – Admin stats overview (total users, tasks, status/priority breakdown)
- **Pagination & Filtering** – Search, filter by status/priority, paginated lists throughout
- **Security** – Password hashing, JWT auth, request validation, security headers, rate limiting

## Database Models

- **User** – `id`, `name`, `email`, `password`, `role` (admin/user), `is_active`, `profile_image`
- **Task** – `id`, `title`, `description`, `status`, `priority`, `due_date`, `assigned_to`, `created_by`
- **Category** – `id`, `name`, `color`
- **RefreshToken** – `id`, `user_id`, `token`, `expires_at`
- **TaskCategory** – Junction table for many-to-many task–category relationship

## API Overview (`/api/v1`)

| Resource | Endpoints |
|----------|-----------|
| **Auth** | `POST /auth/register`, `/login`, `/refresh`, `/logout` |
| **Users** | `GET /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id` |
| **Tasks** | `GET /tasks`, `POST /tasks`, `GET /tasks/:id`, `PUT /tasks/:id`, `PATCH /tasks/:id/status`, `DELETE /tasks/:id` |
| **Categories** | `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id` |
| **Dashboard** | `GET /dashboard/stats` (admin only) |
| **Health** | `GET /health` |

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL instance (or Neon connection string)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd task-manager

# Backend setup
cd Backend
cp .env.example .env   # configure your DATABASE_URL and JWT secrets
npm install
npm run dev

# Frontend setup (new terminal)
cd Frontend
npm install
npm run dev
```

### Environment Variables (`Backend/.env`)

```
DATABASE_URL=postgresql://user:pass@host/db
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── config/        # Database & app configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, role, validation, error handling
│   │   ├── models/        # Sequelize models (User, Task, Category, ...)
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # Business logic layer
│   │   ├── utils/         # Helpers
│   │   ├── validations/   # Joi schemas
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point
│   └── database/          # Migrations / seeds
└── Frontend/
    ├── src/
    │   ├── api/           # Axios/fetch helpers
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Route pages (Login, Tasks, Dashboard, etc.)
    │   ├── assets/        # Static assets
    │   ├── App.jsx
    │   └── main.jsx       # Entry point
    └── index.html
```
