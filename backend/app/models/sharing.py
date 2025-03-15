from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class ShareableType(str, enum.Enum):
    BLOOD_REQUEST = "blood_request"
    BLOOD_LISTING = "blood_listing"
    DEVICE_LISTING = "device_listing"
    CAREGIVER_LISTING = "caregiver_listing"
    DEVICE_REQUEST = "device_request"
    CAREGIVER = "caregiver"

class SharingPlatform(str, enum.Enum):
    FACEBOOK = "facebook"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    WHATSAPP = "whatsapp"
    EMAIL = "email"

class Share(Base):
    __tablename__ = "shares"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shareable_type = Column(Enum(ShareableType), nullable=False)
    shareable_id = Column(Integer, nullable=False)  # ID of the shared item
    platform = Column(Enum(SharingPlatform), nullable=False)
    share_url = Column(String)
    share_metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")

    def get_shareable(self, db):
        """Get the actual shareable object based on type and ID"""
        from app.models.blood_donation import BloodDonationRequest, BloodDonationListing
        from app.models.assistive_device import AssistiveDeviceListing
        from app.models.caregiver import CaregiverListing

        if self.shareable_type == ShareableType.BLOOD_REQUEST:
            return db.query(BloodDonationRequest).get(self.shareable_id)
        elif self.shareable_type == ShareableType.BLOOD_LISTING:
            return db.query(BloodDonationListing).get(self.shareable_id)
        elif self.shareable_type == ShareableType.DEVICE_LISTING:
            return db.query(AssistiveDeviceListing).get(self.shareable_id)
        elif self.shareable_type == ShareableType.CAREGIVER_LISTING:
            return db.query(CaregiverListing).get(self.shareable_id)
        return None 