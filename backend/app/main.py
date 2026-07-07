from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_indexes

from app.controllers import (
    auth_controller,
    user_controller,
    task_controller,
    dashboard_controller
)

from app.core.oauth2 import get_current_active_user


app = FastAPI(
    title="Secure Task Manager API",
    description="FastAPI + MongoDB backend with JWT/OAuth2 auth and role-based access control.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register controllers
app.include_router(auth_controller.controller)
app.include_router(user_controller.controller)
app.include_router(task_controller.controller)



@app.on_event("startup")
async def on_startup():
    await init_indexes()



@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok"
    }



@app.get("/api/dashboard", tags=["Dashboard"])
async def dashboard(
    user: dict = Depends(get_current_active_user)
):

    return await dashboard_controller.get_dashboard_data(user)