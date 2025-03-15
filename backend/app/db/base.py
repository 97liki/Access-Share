from app.db.base_class import Base
from app.models.user import User
from app.models.blood_donation import BloodDonationRequest, BloodDonationResponse
from app.models.assistive_device import AssistiveDeviceListing, AssistiveDeviceRequest, AssistiveDeviceResponse, DeviceReview
from app.models.caregiver import CaregiverListing, CaregiverRequest, CaregiverResponse, CaregiverReview

# All models should be imported here for Alembic to detect them
__all__ = [
    "Base",
    "User",
    "BloodDonationRequest",
    "BloodDonationResponse",
    "AssistiveDeviceListing",
    "AssistiveDeviceRequest",
    "AssistiveDeviceResponse",
    "DeviceReview",
    "CaregiverListing",
    "CaregiverRequest",
    "CaregiverResponse",
    "CaregiverReview"
]