from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth,
    blood_donation,
    assistive_device,
    caregiver,
    users
)

api_router = APIRouter()

# Auth endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# User endpoints
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Blood donation endpoints
api_router.include_router(blood_donation.router, prefix="/blood-donation", tags=["blood-donation"])

# Assistive device endpoints
api_router.include_router(assistive_device.router, prefix="/devices", tags=["devices"])

# Caregiver endpoints
api_router.include_router(caregiver.router, prefix="/caregivers", tags=["caregivers"])