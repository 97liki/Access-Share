from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, not_
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse
from datetime import datetime
import traceback
import sys

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        print(f"Registration attempt with data: {user_data.dict(exclude={'password'})}")
        
        # Check if user with this email exists but is deleted (can be reactivated)
        deleted_user = db.query(User).filter(User.email == user_data.email, User.deleted_at.is_not(None)).first()
        if deleted_user:
            print(f"Found deleted user with same email, will reactivate: {deleted_user.id}")
            
            # Update the user's data
            deleted_user.username = user_data.username
            deleted_user.hashed_password = User.get_password_hash(user_data.password)
            deleted_user.deleted_at = None
            
            db.commit()
            db.refresh(deleted_user)
            print(f"Reactivated user successfully, id: {deleted_user.id}")
            return deleted_user
        
        # Check if user with this username exists but is deleted (can be reactivated)
        deleted_user_by_username = db.query(User).filter(User.username == user_data.username, 
                                                         User.deleted_at.is_not(None)).first()
        if deleted_user_by_username:
            print(f"Found deleted user with same username, will reactivate: {deleted_user_by_username.id}")
            
            # Update the user's data
            deleted_user_by_username.email = user_data.email
            deleted_user_by_username.hashed_password = User.get_password_hash(user_data.password)
            deleted_user_by_username.deleted_at = None
            
            db.commit()
            db.refresh(deleted_user_by_username)
            print(f"Reactivated user successfully, id: {deleted_user_by_username.id}")
            return deleted_user_by_username
        
        # Check if active user already exists with this email
        if db.query(User).filter(User.email == user_data.email, User.deleted_at.is_(None)).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if active user already exists with this username
        if db.query(User).filter(User.username == user_data.username, User.deleted_at.is_(None)).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        try:
            # Create new user with email, username and hashed password
            hashed_password = User.get_password_hash(user_data.password)
            print(f"Password hashing successful")
            
            db_user = User(
                email=user_data.email,
                username=user_data.username,
                hashed_password=hashed_password,
                full_name=user_data.username  # Default full_name to username
            )
            print(f"User object created")
            
            db.add(db_user)
            print(f"User added to session")
            
            db.commit()
            print(f"Transaction committed")
            
            db.refresh(db_user)
            print(f"User refreshed, id: {db_user.id}")
            
            return db_user
        except Exception as inner_e:
            print(f"Error during user creation: {str(inner_e)}")
            print(traceback.format_exc())
            db.rollback()
            raise
    except HTTPException as http_e:
        print(f"HTTP exception during registration: {http_e.detail}")
        raise
    except Exception as e:
        db.rollback()
        print(f"Unexpected error during registration: {str(e)}")
        print(f"Error type: {type(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )

@router.post("/login", response_model=UserResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    try:
        print(f"Login attempt with email: {login_data.email}")
        
        user = db.query(User).filter(User.email == login_data.email, User.deleted_at.is_(None)).first()
        if not user:
            print(f"User not found with email: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please register first."
            )
            
        print(f"User found with email: {login_data.email}, id: {user.id}")
        
        if not user.verify_password(login_data.password):
            print(f"Incorrect password for user: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password"
            )
            
        print(f"Login successful for user: {login_data.email}")
        return user
    except HTTPException as http_e:
        print(f"HTTP exception during login: {http_e.detail}")
        raise
    except Exception as e:
        print(f"Unexpected error during login: {str(e)}")
        print(f"Error type: {type(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db), x_user_email: str = Header(None, alias="X-User-Email")):
    """Get current user details"""
    if not x_user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = db.query(User).filter(User.email == x_user_email, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.delete("/delete-account", response_model=dict)
def delete_account(db: Session = Depends(get_db), x_user_email: str = Header(None, alias="X-User-Email")):
    """Delete user account (soft delete)"""
    if not x_user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        user = db.query(User).filter(User.email == x_user_email, User.deleted_at.is_(None)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Soft delete the user by setting deleted_at timestamp
        user.deleted_at = datetime.now()
        db.commit()
        
        return {"success": True, "message": "Account successfully deleted"}
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the account: {str(e)}"
        )