from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.caregiver import (
    ServiceType,
    ExperienceLevel,
    AvailabilityStatus,
    RequestStatus,
    ResponseStatus
)

# User info schema for caregiver listings
class UserInfo(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    phone_number: Optional[str] = None
    location: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True

# Listing schemas
class CaregiverListingBase(BaseModel):
    service_type: ServiceType
    experience_level: ExperienceLevel
    hourly_rate: float
    description: str
    location: str
    contact_info: str
    availability_status: AvailabilityStatus = AvailabilityStatus.AVAILABLE

class CaregiverListingCreate(CaregiverListingBase):
    pass

class CaregiverListingResponse(CaregiverListingBase):
    id: int
    caregiver_id: int
    caregiver: UserInfo  # Include full user information
    rating: Optional[float] = None
    review_count: Optional[int] = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Request schemas
class CaregiverRequestBase(BaseModel):
    service_type: ServiceType
    location: str
    contact_info: str
    description: str
    status: RequestStatus

class CaregiverRequestCreate(CaregiverRequestBase):
    pass

class CaregiverRequestResponse(CaregiverRequestBase):
    id: int
    receiver_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Response schemas
class CaregiverResponseBase(BaseModel):
    listing_id: int
    request_id: int
    status: ResponseStatus
    message: Optional[str] = None

class CaregiverResponseCreate(CaregiverResponseBase):
    pass

class CaregiverResponseResponse(CaregiverResponseBase):
    id: int
    caregiver_id: int
    receiver_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Review schemas
class CaregiverReviewBase(BaseModel):
    listing_id: int
    rating: float
    comment: Optional[str] = None

class CaregiverReviewCreate(CaregiverReviewBase):
    pass

class CaregiverReviewResponse(CaregiverReviewBase):
    id: int
    reviewer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True