from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.sharing import Share, ShareableType
from app.schemas.sharing import ShareCreate, ShareResponse, ShareStats
from app.services.sharing import SharingService
from app.services.notifications import notify_new_post  # Import the notification function

router = APIRouter()

@router.post("/", response_model=ShareResponse)
def create_share(
    share: ShareCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new share"""
    sharing_service = SharingService(db)
    try:
        new_share = sharing_service.create_share(
            user_id=current_user.id,
            shareable_type=share.shareable_type,
            shareable_id=share.shareable_id,
            platform=share.platform
        )

        # Notify about the new post
        notify_new_post(user_id=current_user.id, share=new_share)

        return new_share
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get("/stats/{shareable_type}/{shareable_id}", response_model=ShareStats)
def get_share_stats(
    shareable_type: ShareableType,
    shareable_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get sharing statistics for a shareable object"""
    sharing_service = SharingService(db)
    return sharing_service.get_share_stats(shareable_type, shareable_id)

@router.get("/my-shares", response_model=List[ShareResponse])
def get_user_shares(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's sharing history"""
    sharing_service = SharingService(db)
    return sharing_service.get_user_shares(
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
