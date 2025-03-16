from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

security = HTTPBasic()

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPBasicCredentials = Depends(security)
) -> User:
    user = db.query(User).filter(User.email == credentials.username, User.deleted_at.is_(None)).first()
    if not user or not user.verify_password(credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return user

def get_current_user_optional(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPBasicCredentials] = Depends(security)
) -> Optional[User]:
    if not credentials:
        return None
    try:
        return get_current_user(db, credentials)
    except HTTPException:
        return None
