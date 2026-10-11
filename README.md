# Mini Task Management System

A full-stack task manager built with **React (Vite)**, **Node.js + Express** and **MongoDB (Mongoose)**.

## Features

- Create, view, edit and delete tasks (title, description, status, optional due date)
- Data stored in MongoDB
- REST API with full CRUD
- Frontend fully integrated with the API
- Input validation on both client and server; API errors shown in the UI
- Filter by status (sidebar and pills), search by title/description
- Responsive layout (desktop, tablet, mobile)

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## Setup and run

Open two terminals.

**1. Backend**

```bash
cd server
npm install
cp .env.example .env      # edit MONGO_URI if needed (Windows: copy .env.example .env)
npm run dev               # or: npm start
```

API runs at http://localhost:5000 (health check: `GET /api/health`).

**2. Frontend**

```bash
cd client
npm install
npm run dev
```

App runs at http://localhost:5173. Vite proxies `/api` to `http://localhost:5000`, so no CORS or URL config is needed in development.

### Environment variables (`server/.env`)

| Variable        | Default                                  | Purpose                 |
| --------------- | ---------------------------------------- | ----------------------- |
| `PORT`          | `5000`                                   | API port                |
| `MONGO_URI`     | `mongodb://127.0.0.1:27017/task_manager` | MongoDB connection      |
| `CLIENT_ORIGIN` | `http://localhost:5173`                  | Allowed CORS origin     |

## Project structure

```
task-manager/
├── server/
│   ├── server.js                  # App entry: middleware, routes, DB connect
│   ├── config/db.js               # Mongoose connection
│   ├── models/Task.js             # Schema (title, description, status, timestamps)
│   ├── routes/taskRoutes.js       # Route → middleware → controller wiring
│   ├── controllers/taskController.js  # CRUD logic
│   └── middleware/
│       ├── validate.js            # ObjectId + request body validation
│       └── errorHandler.js        # 404 + centralized error responses
└── client/
    ├── vite.config.js            # Dev server + /api proxy
    └── src/
        ├── main.jsx              # React entry
        ├── App.jsx               # State, data loading, filter/search, handlers
        ├── api.js                # fetch wrapper for the REST API
        ├── styles.css
        └── components/
            ├── Sidebar.jsx       # Navigation / status filter
            ├── TaskForm.jsx      # Add New Task form (+ client validation)
            ├── TaskItem.jsx      # One task row with Edit / Delete
            ├── EditModal.jsx     # Edit dialog
            └── Icon.jsx          # SVG icons
```

## API

Base URL: `/api/tasks`

| Method | Endpoint     | Description                                           | Success |
| ------ | ------------ | ----------------------------------------------------- | ------- |
| GET    | `/`          | List tasks. Optional `?status=Pending&search=text`    | 200     |
| GET    | `/:id`       | Get one task                                          | 200     |
| POST   | `/`          | Create a task `{ title, description?, status? }`      | 201     |
| PUT    | `/:id`       | Update any of `title`, `description`, `status`        | 200     |
| DELETE | `/:id`       | Delete a task                                         | 200     |

**Task:** `{ _id, title, description, status, dueDate, createdAt, updatedAt }`
`status` is one of `Pending` (default), `In Progress`, `Completed`.
`dueDate` is optional and uses the `YYYY-MM-DD` format; send an empty string to clear it.

**Validation rules:** title required, 3–100 chars; description max 500 chars; status must be one of the three values; due date must be a valid calendar date in `YYYY-MM-DD` format.

**Errors** are JSON: `{ "message": "...", "errors": ["..."] }`

| Code | When                                                          |
| ---- | ------------------------------------------------------------- |
| 400  | Validation failed, invalid id, malformed JSON                 |
| 404  | Task or route not found                                       |
| 500  | Unexpected server error                                       |

Example:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write unit tests","description":"API endpoints","status":"Pending"}'
```

## API flow (example: adding a task)

1. User fills `TaskForm` and submits; the form validates locally (title length etc.).
2. `api.create()` sends `POST /api/tasks` (Vite proxies to Express).
3. Express runs `validateTaskBody` → `createTask` controller → `Task.create()` saves to MongoDB.
4. Server responds `201` with the saved task (or `400` with error messages).
5. `App` shows a toast and re-fetches the list with `GET /api/tasks` (respecting the current filter and search), so the UI always reflects the database.

Edit (`PUT`) and delete (`DELETE`) follow the same path. Errors from the server are thrown by `api.js` and displayed in the form, modal or an error banner with a Retry button.

## Design decisions

- **Controller / route / middleware split** keeps the API easy to read and extend.
- **Validation in two layers:** client for fast feedback, server (middleware + Mongoose schema) as the source of truth.
- **Filtering and search are server-side** (query params), with a 300 ms debounce on search.
- **Re-fetch after mutations** instead of patching local state keeps things simple and consistent.

## Known limitations / not implemented

- No authentication; the "MO" avatar is decorative.
- No pagination (all matching tasks are returned).
- No automated tests (API was exercised manually with curl / the UI).
- Delete uses the browser `confirm()` dialog.
