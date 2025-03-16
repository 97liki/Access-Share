from fastapi import Header, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.models.user import User

def get_current_user(x_user_email: Optional[str] = Header(None, alias="X-User-Email"), db: Session = Depends(get_db)) -> User:
    """Basic authentication using email header"""
    if not x_user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    user = db.query(User).filter(User.email == x_user_email, User.deleted_at == None).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user
