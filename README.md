# Flow — Secure Task Manager

ReactJS + FastAPI + MongoDB task management app with JWT/OAuth2 authentication
and role-based access control (RBAC).

## Folder structure

```
task-manager/
├── backend/            FastAPI app (auth, RBAC, tasks API)
└── frontend/            React (Vite) app
```

See inline comments in each file for details. Full structure:

```
backend/
├── app/
│   ├── main.py                # FastAPI entrypoint, CORS, controller registration
│   ├── config.py              # Settings loaded from .env
│   ├── database.py            # MongoDB (Motor) connection + indexes
│   ├── models/                # Mongo document shape helpers
│   ├── schemas/                # Pydantic request/response models + validation
│   ├── core/
│   │   ├── security.py        # bcrypt hashing, JWT create/verify
│   │   ├── oauth2.py          # OAuth2PasswordBearer + get_current_user
│   │   └── permissions.py     # require_role() RBAC dependency
│   ├── controllers/            # HTTP endpoints: /api/auth, /api/users, /api/tasks
│   ├── services/                # business logic
│   └── seed_admin.py           # one-off script to bootstrap the first admin
├── tests/
└── requirements.txt

frontend/
├── src/
│   ├── api/                    # axios client + endpoint calls
│   ├── context/AuthContext.jsx # JWT/session state
│   ├── components/
│   │   ├── auth/                # Login / Register forms
│   │   ├── tasks/                # TaskList / TaskCard
│   │   └── common/ProtectedRoute.jsx
│   ├── pages/                  # Login, Register, Dashboard
│   ├── utils/validators.js      # client-side email/password rules
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Auth rules enforced (frontend + backend)

- **Email**: must contain `@` and a valid domain (e.g. `name@example.com`).
- **Password**: minimum 6 characters, at least 1 uppercase letter, 1 lowercase
  letter, and 1 special character.

These are validated in the browser for instant feedback, and re-validated on
the server (source of truth) via Pydantic validators — never trust the client
alone.

## Auth flow

1. `POST /api/auth/register` — creates a user, password is hashed with bcrypt.
2. `POST /api/auth/login-json` — verifies credentials, returns a short-lived
   **access token** (JWT, 30 min) and a longer-lived **refresh token** (7 days).
3. `POST /api/auth/login` — same as above but as an OAuth2 password-flow form,
   used by Swagger UI's "Authorize" button and standard OAuth2 clients.
4. Protected routes require `Authorization: Bearer <access_token>`.
5. `POST /api/auth/refresh` — exchanges a valid refresh token for a new access
   token once the access token expires (handled automatically by the frontend
   axios interceptor).

## Role-based access control

Two roles: `user` and `admin`.

- **Admins**: create tasks and assign them to a specific user, reassign or
  edit any task, delete any task, and see every task in the system.
- **Users**: only see the tasks that have been assigned to them, and can
  update a task's status ("to do" → "in progress" → "done"). Users cannot
  create or delete tasks.
- Enforced server-side (not just hidden in the UI) via the `require_role(...)`
  FastAPI dependency on `POST /api/tasks` and `DELETE /api/tasks/{id}`, and
  via ownership checks in `task_service` for reads/updates.

### Creating your first admin

Public sign-up (`POST /api/auth/register`) always creates a regular `user`
account — nobody can grant themselves admin through the signup form. To
bootstrap your first admin, run the seed script from the `backend/` directory:

```bash
python -m app.seed_admin admin@example.com "StrongPass1!" "Admin Name"
```

This creates the account (or promotes it, if that email already exists).
Once you have one admin, they can promote/demote any other user from the
app via `PATCH /api/users/{user_id}/role` with body `{"role": "admin"}`.

## Running locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then edit SECRET_KEY, MONGO_URI, etc.
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env             # confirm VITE_API_URL points at your backend
npm run dev
```

App available at `http://localhost:5173`.

## Tests

```bash
cd backend
pip install pytest
pytest
```
