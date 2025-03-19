from typing import Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationType, NotificationPreference
from app.models.user import User
import json

class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def create_notification(
        self,
        user_id: int,
        type: NotificationType,
        title: str,
        message: str,
        link: Optional[str] = None
    ) -> Notification:
        """Create a new notification"""
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            link=link
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_user_notifications(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 50,
        unread_only: bool = False
    ) -> list[Notification]:
        """Get notifications for a user"""
        query = self.db.query(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            query = query.filter(Notification.is_read == False)
        return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()

    def mark_as_read(self, notification_id: int, user_id: int) -> Notification:
        """Mark a notification as read"""
        notification = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()
        if notification:
            notification.is_read = True
            self.db.commit()
            self.db.refresh(notification)
        return notification

    def mark_all_as_read(self, user_id: int) -> None:
        """Mark all notifications as read for a user"""
        self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({"is_read": True})
        self.db.commit()

    def get_notification_preferences(self, user_id: int) -> NotificationPreference:
        """Get notification preferences for a user"""
        preferences = self.db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id
        ).first()
        if not preferences:
            # Create default preferences if they don't exist
            preferences = NotificationPreference(
                user_id=user_id,
                notification_types=json.dumps([t.value for t in NotificationType])
            )
            self.db.add(preferences)
            self.db.commit()
            self.db.refresh(preferences)
        return preferences

    def update_notification_preferences(
        self,
        user_id: int,
        email_notifications: Optional[bool] = None,
        push_notifications: Optional[bool] = None,
        in_app_notifications: Optional[bool] = None,
        notification_types: Optional[list[str]] = None
    ) -> NotificationPreference:
        """Update notification preferences for a user"""
        preferences = self.get_notification_preferences(user_id)
        
        if email_notifications is not None:
            preferences.email_notifications = email_notifications
        if push_notifications is not None:
            preferences.push_notifications = push_notifications
        if in_app_notifications is not None:
            preferences.in_app_notifications = in_app_notifications
        if notification_types is not None:
            preferences.notification_types = json.dumps(notification_types)
        
        self.db.commit()
        self.db.refresh(preferences)
        return preferences

    def notify_request_received(self, user: User, request_type: str, request_id: int) -> None:
        """Create notification for received request"""
        self.create_notification(
            user_id=user.id,
            type=NotificationType.REQUEST_RECEIVED,
            title=f"New {request_type} Request",
            message=f"You have received a new {request_type} request",
            link=f"/{request_type}/requests/{request_id}"
        )

    def notify_response_received(self, user: User, response_type: str, response_id: int) -> None:
        """Create notification for received response"""
        self.create_notification(
            user_id=user.id,
            type=NotificationType.RESPONSE_RECEIVED,
            title=f"New {response_type} Response",
            message=f"You have received a new {response_type} response",
            link=f"/{response_type}/responses/{response_id}"
        )

    def notify_status_updated(self, user: User, item_type: str, item_id: int, new_status: str) -> None:
        """Create notification for status update"""
        self.create_notification(
            user_id=user.id,
            type=NotificationType.STATUS_UPDATED,
            title=f"{item_type} Status Updated",
            message=f"The status of your {item_type} has been updated to {new_status}",
            link=f"/{item_type}/{item_id}"
        )

    def notify_review_received(self, user: User, review_type: str, review_id: int) -> None:
        """Create notification for received review"""
        self.create_notification(
            user_id=user.id,
            type=NotificationType.REVIEW_RECEIVED,
            title=f"New {review_type} Review",
            message=f"You have received a new {review_type} review",
            link=f"/{review_type}/reviews/{review_id}"
        )
    
    def notify_new_post(self, user: User, post_id: int) -> None:
        """Create notification for a new post"""
        self.create_notification(
            user_id=user.id,
            type=NotificationType.NEW_POST,
            title="New Post Available",
            message="A new post has been published! Check it out.",
            link=f"/posts/{post_id}"
        )
