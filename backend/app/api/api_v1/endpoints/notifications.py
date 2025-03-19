from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.notification import Notification, NotificationType, NotificationPreference
from app.schemas.notification import (
    NotificationResponse,
    NotificationPreferenceResponse,
    NotificationPreferenceUpdate
)
from app.services.notification import NotificationService

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def read_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user notifications"""
    notification_service = NotificationService(db)
    return notification_service.get_user_notifications(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        unread_only=unread_only
    )

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    notification_service = NotificationService(db)
    notification = notification_service.mark_as_read(notification_id, current_user.id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    return notification

@router.put("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read"""
    notification_service = NotificationService(db)
    notification_service.mark_all_as_read(current_user.id)
    return None

@router.get("/preferences", response_model=NotificationPreferenceResponse)
def read_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user notification preferences"""
    notification_service = NotificationService(db)
    return notification_service.get_notification_preferences(current_user.id)

@router.put("/preferences", response_model=NotificationPreferenceResponse)
def update_notification_preferences(
    preferences: NotificationPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user notification preferences"""
    notification_service = NotificationService(db)
    return notification_service.update_notification_preferences(
        user_id=current_user.id,
        email_notifications=preferences.email_notifications,
        push_notifications=preferences.push_notifications,
        in_app_notifications=preferences.in_app_notifications,
        notification_types=preferences.notification_types
    )

def notify_new_post(post_id: int, user: User, db: Session):
    """Trigger notification when a new post is created"""
    notification_service = NotificationService(db)
    notification_service.create_notification(
        user_id=user.id,
        type=NotificationType.NEW_POST,
        message=f"New post created with ID {post_id}"
    )
