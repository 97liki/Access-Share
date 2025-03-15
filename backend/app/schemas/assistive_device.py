from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssistiveDeviceListingBase(BaseModel):
    device_name: str
    device_type: str
    condition: str
    description: str
    location: str
    contact_info: str

class AssistiveDeviceListingCreate(AssistiveDeviceListingBase):
    pass

class AssistiveDeviceListingResponse(AssistiveDeviceListingBase):
    id: int
    donor_id: int
    available: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AssistiveDeviceRequestBase(BaseModel):
    listing_id: int
    message: str

class AssistiveDeviceRequestCreate(AssistiveDeviceRequestBase):
    pass

class AssistiveDeviceRequestResponse(AssistiveDeviceRequestBase):
    id: int
    receiver_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AssistiveDeviceResponseBase(BaseModel):
    request_id: int
    listing_id: int
    message: str
    status: str

class AssistiveDeviceResponseCreate(AssistiveDeviceResponseBase):
    pass

class AssistiveDeviceResponseResponse(AssistiveDeviceResponseBase):
    id: int
    donor_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DeviceReviewBase(BaseModel):
    listing_id: int
    rating: float
    comment: Optional[str] = None

class DeviceReviewCreate(DeviceReviewBase):
    pass

class DeviceReviewResponse(DeviceReviewBase):
    id: int
    reviewer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True