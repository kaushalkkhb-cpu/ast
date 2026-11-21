import os
from datetime import datetime, timedelta, timezone
import jwt
from pwdlib import PasswordHash

_password_hash = PasswordHash.recommended()
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "LOCAL-ONLY-CHANGE-ME-BEFORE-DEPLOYMENT")
if os.getenv("ENVIRONMENT", "development").lower() == "production" and JWT_SECRET_KEY == "LOCAL-ONLY-CHANGE-ME-BEFORE-DEPLOYMENT":
    raise RuntimeError("Set a strong JWT_SECRET_KEY in the production environment before starting AST PRO.")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "30"))

def hash_password(password: str) -> str:
    return _password_hash.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return _password_hash.verify(password, hashed)

def create_access_token(subject: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    return jwt.encode({"sub": subject, "exp": expires}, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
