from fastapi import HTTPException, status

def require_role(user: dict, role: str):
    if user.get("role") != role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
