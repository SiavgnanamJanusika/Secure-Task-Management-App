# Secure-Task-Management-App
Secure Task Management App


<!-- fastapi
uvicorn
pymongo
motor
pydantic
passlib[bcrypt]
python-jose[cryptography]
python-multipart
python-dotenv -->



# J2A Secure Task

Full-stack secure task management:
- Frontend: React (Vite), React Router, Axios
- Backend: FastAPI, JWT, MongoDB Atlas (Motor)
- Auth: Register/Login, role-based (admin/user)
- Features:
  - Navbar: Home, Task, Profile, Dashboard
  - Login/Register first flow
  - Home shows "J2A Secure Task" with background
  - Task page: name, description, duration, status, CRUD
  - Profile: edit username and password (email locked)
  - Dashboard:
    - User: completed tasks, durations, statuses
    - Admin: create tasks for users, user list, tasks history

## Backend setup

1. cd backend
2. python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
3. pip install -r requirements.txt
4. Create `.env` (see example in repo). Set MONGODB_URI (Atlas), JWT_SECRET, etc.
5. uvicorn app.main:app --reload --port 8000

## Frontend setup

1. cd frontend
2. npm install
3. Create `.env` with VITE_API_BASE=[localhost](http://localhost:8000)
4. npm run dev  # runs on [localhost](http://localhost:5173)

## Notes

- First user registering will be a regular user. To create an admin, use the admin create-user endpoint (e.g., via HTTP client) or temporarily set role in DB.
- Secure storage: JWT stored in localStorage for demo; for production use httpOnly cookies and stricter CORS.
- Validate image assets exist in frontend/public/images.
- For production, configure CORS, HTTPS, secrets, and indexes in MongoDB.
