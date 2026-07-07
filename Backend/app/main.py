from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth, users, profile, tasks, dashboard, admin

app = FastAPI(title="J2A Secure Task API")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profile.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "J2A Secure Task API running"}
