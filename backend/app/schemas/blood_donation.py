from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BloodDonationRequestBase(BaseModel):
    blood_type: str  # A+, A-, B+, B-, AB+, AB-, O+, O-
    location: str
    urgency: str  # High, Medium, Low
    contact_number: str
    notes: Optional[str] = None

class BloodDonationRequestCreate(BloodDonationRequestBase):
    pass

class BloodDonationRequestResponse(BloodDonationRequestBase):
    id: int
    user_id: int
    status: str  # available, unavailable
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BloodDonationResponseBase(BaseModel):
    request_id: int
    message: str

class BloodDonationResponseCreate(BloodDonationResponseBase):
    pass

class BloodDonationResponseResponse(BloodDonationResponseBase):
    id: int
    donor_id: int
    status: str  # pending, accepted, rejected
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True