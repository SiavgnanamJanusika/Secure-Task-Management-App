"""
One-off script to create (or promote) the first admin account.

Since public registration always creates regular "user" accounts (by
design — nobody should be able to grant themselves admin through the
signup form), you need this script to bootstrap your very first admin.
Every admin created after that can promote other users from the app
itself via PATCH /api/users/{user_id}/role.

Usage (from the backend/ directory, with your virtualenv active and
MONGO_URI / MONGO_DB_NAME set as in your .env):

    python -m app.seed_admin admin@example.com "StrongPass1!" "Admin Name"

If the email already exists, the script promotes that existing account
to admin instead of creating a duplicate.
"""

import asyncio
import sys

from app.database import users_collection
from app.core.security import hash_password
from app.models.user_model import new_user_document, Role


async def seed_admin(email: str, password: str, full_name: str) -> None:
    email = email.lower().strip()
    existing = await users_collection.find_one({"email": email})

    if existing:
        await users_collection.update_one({"_id": existing["_id"]}, {"$set": {"role": Role.ADMIN.value}})
        print(f"Existing user '{email}' promoted to admin.")
        return

    doc = new_user_document(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        role=Role.ADMIN.value,
    )
    await users_collection.insert_one(doc)
    print(f"Admin account '{email}' created.")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print('Usage: python -m app.seed_admin <email> <password> "<full name>"')
        sys.exit(1)

    _, arg_email, arg_password, arg_full_name = sys.argv
    asyncio.run(seed_admin(arg_email, arg_password, arg_full_name))
