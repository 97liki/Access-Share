from typing import Optional
from sqlalchemy.orm import Session
from app.models.sharing import Share, ShareableType
from app.models.user import User
from app.core.config import settings
import urllib.parse

class SharingService:
    def __init__(self, db: Session):
        self.db = db
        self.base_url = settings.FRONTEND_URL

    def create_share(
        self,
        user_id: int,
        shareable_type: ShareableType,
        shareable_id: int,
        platform: str
    ) -> Share:
        """Create a share record and generate share URL"""
        shareable = self._get_shareable_object(shareable_type, shareable_id)
        if not shareable:
            raise ValueError(f"Shareable object not found: {shareable_type} {shareable_id}")

        share_url = self._generate_share_url(shareable_type, shareable_id, platform)
        
        share = Share(
            user_id=user_id,
            shareable_type=shareable_type,
            shareable_id=shareable_id,
            platform=platform,
            share_url=share_url
        )
        
        self.db.add(share)
        self.db.commit()
        self.db.refresh(share)
        return share

    def _get_shareable_object(self, shareable_type: ShareableType, shareable_id: int):
        """Get the actual shareable object based on type and ID"""
        if shareable_type == ShareableType.BLOOD_REQUEST:
            return self.db.query(BloodDonationRequest).get(shareable_id)
        elif shareable_type == ShareableType.BLOOD_LISTING:
            return self.db.query(BloodDonationListing).get(shareable_id)
        elif shareable_type == ShareableType.DEVICE_LISTING:
            return self.db.query(AssistiveDeviceListing).get(shareable_id)
        elif shareable_type == ShareableType.CAREGIVER_LISTING:
            return self.db.query(CaregiverListing).get(shareable_id)
        return None

    def _generate_share_url(self, shareable_type: ShareableType, shareable_id: int, platform: str) -> str:
        """Generate share URL based on platform"""
        base_path = self._get_base_path(shareable_type)
        content_url = f"{self.base_url}/{base_path}/{shareable_id}"
        
        if platform == "facebook":
            return f"https://www.facebook.com/sharer/sharer.php?u={urllib.parse.quote(content_url)}"
        elif platform == "twitter":
            return f"https://twitter.com/intent/tweet?url={urllib.parse.quote(content_url)}"
        elif platform == "whatsapp":
            return f"https://wa.me/?text={urllib.parse.quote(content_url)}"
        elif platform == "linkedin":
            return f"https://www.linkedin.com/shareArticle?mini=true&url={urllib.parse.quote(content_url)}"
        else:
            return content_url

    def _get_base_path(self, shareable_type: ShareableType) -> str:
        """Get the base path for the shareable type"""
        paths = {
            ShareableType.BLOOD_REQUEST: "blood-donation/requests",
            ShareableType.BLOOD_LISTING: "blood-donation/listings",
            ShareableType.DEVICE_LISTING: "assistive-devices/listings",
            ShareableType.CAREGIVER_LISTING: "caregivers/listings"
        }
        return paths.get(shareable_type, "")

    def get_share_stats(self, shareable_type: ShareableType, shareable_id: int) -> dict:
        """Get sharing statistics for a shareable object"""
        shares = self.db.query(Share).filter(
            Share.shareable_type == shareable_type,
            Share.shareable_id == shareable_id
        ).all()
        
        platform_stats = {}
        for share in shares:
            platform_stats[share.platform] = platform_stats.get(share.platform, 0) + 1
        
        return {
            "total_shares": len(shares),
            "platform_stats": platform_stats
        }

    def get_user_shares(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 50
    ) -> list[Share]:
        """Get sharing history for a user"""
        return self.db.query(Share).filter(
            Share.user_id == user_id
        ).order_by(Share.created_at.desc()).offset(skip).limit(limit).all() 