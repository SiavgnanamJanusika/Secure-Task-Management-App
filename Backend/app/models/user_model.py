from datetime import datetime
from bson import ObjectId


def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "password": user["password"],
        "role": user.get("role", "user"),
        "created_at": user.get("created_at")
    }


class UserModel:

    def __init__(
        self,
        username: str,
        email: str,
        password: str,
        role: str = "user"
    ):
        self.username = username
        self.email = email
        self.password = password
        self.role = role
        self.created_at = datetime.utcnow()


    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "role": self.role,
            "created_at": self.created_at
        }