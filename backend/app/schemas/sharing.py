from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime
from app.models.sharing import ShareableType, SharingPlatform

class ShareBase(BaseModel):
    shareable_type: ShareableType
    shareable_id: int
    platform: SharingPlatform

class ShareCreate(ShareBase):
    pass

class ShareResponse(ShareBase):
    id: int
    user_id: int
    share_url: Optional[str] = None
    share_metadata: Optional[Dict] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ShareStats(BaseModel):
    total_shares: int
    platform_stats: Dict[SharingPlatform, int] 