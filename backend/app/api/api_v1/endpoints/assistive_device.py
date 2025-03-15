from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.user import User
from app.models.assistive_device import AssistiveDeviceListing, AssistiveDeviceRequest, AssistiveDeviceResponse, DeviceReview
from app.schemas.assistive_device import (
    AssistiveDeviceListingCreate,
    AssistiveDeviceListingResponse,
    AssistiveDeviceRequestCreate,
    AssistiveDeviceRequestResponse,
    AssistiveDeviceResponseCreate,
    AssistiveDeviceResponseResponse,
    DeviceReviewCreate,
    DeviceReviewResponse
)

router = APIRouter()

# Listing endpoints
@router.post("/listings", response_model=AssistiveDeviceListingResponse)
def create_device_listing(
    listing: AssistiveDeviceListingCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Create a new assistive device listing"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove is_donor check temporarily until role migration is complete
    # if not user.is_donor:
    #    raise HTTPException(status_code=403, detail="User is not registered as a donor")

    # Create the database object
    db_listing = AssistiveDeviceListing(**listing.dict(), donor_id=user.id)
    
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    db_listing.created_at = current_time
    db_listing.updated_at = current_time
    
    # Add, commit, and refresh the object
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.get("/listings", response_model=List[AssistiveDeviceListingResponse])
def get_device_listings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all assistive device listings"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    listings = db.query(AssistiveDeviceListing).offset(skip).limit(limit).all()
    return listings

@router.get("/listings/{listing_id}", response_model=AssistiveDeviceListingResponse)
def read_device_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    listing = db.query(AssistiveDeviceListing).filter(
        AssistiveDeviceListing.id == listing_id
    ).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device listing not found"
        )
    return listing

# Request endpoints
@router.post("/requests", response_model=AssistiveDeviceRequestResponse)
def create_device_request(
    request: AssistiveDeviceRequestCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Create a new assistive device request"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Once the role migration is complete, uncomment this line
    # if not user.is_recipient:
    #    raise HTTPException(status_code=403, detail="User is not registered as a recipient")

    # Verify listing exists
    listing = db.query(AssistiveDeviceListing).filter(AssistiveDeviceListing.id == request.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Device listing not found")

    db_request = AssistiveDeviceRequest(**request.dict(), receiver_id=user.id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=List[AssistiveDeviceRequestResponse])
def get_device_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all assistive device requests"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    requests = db.query(AssistiveDeviceRequest).offset(skip).limit(limit).all()
    return requests

@router.get("/requests/{request_id}", response_model=AssistiveDeviceRequestResponse)
def read_device_request(
    request_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    request = db.query(AssistiveDeviceRequest).filter(
        AssistiveDeviceRequest.id == request_id
    ).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device request not found"
        )
    return request

# Response endpoints
@router.post("/responses", response_model=AssistiveDeviceResponseResponse)
def create_device_response(
    response: AssistiveDeviceResponseCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    # Verify listing and request exist
    listing = db.query(AssistiveDeviceListing).filter(
        AssistiveDeviceListing.id == response.listing_id
    ).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device listing not found"
        )
    
    request = db.query(AssistiveDeviceRequest).filter(
        AssistiveDeviceRequest.id == response.request_id
    ).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device request not found"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_response = AssistiveDeviceResponse(
        **response.dict(),
        donor_id=user.id,
        receiver_id=request.receiver_id
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@router.get("/responses", response_model=List[AssistiveDeviceResponseResponse])
def read_device_responses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    responses = db.query(AssistiveDeviceResponse).offset(skip).limit(limit).all()
    return responses

@router.get("/responses/{response_id}", response_model=AssistiveDeviceResponseResponse)
def read_device_response(
    response_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    response = db.query(AssistiveDeviceResponse).filter(
        AssistiveDeviceResponse.id == response_id
    ).first()
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device response not found"
        )
    return response

@router.put("/responses/{response_id}/status", response_model=AssistiveDeviceResponseResponse)
def update_response_status(
    response_id: int,
    status: str,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    response = db.query(AssistiveDeviceResponse).filter(
        AssistiveDeviceResponse.id == response_id
    ).first()
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device response not found"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    response.status = status
    db.commit()
    db.refresh(response)
    return response

@router.post("/reviews", response_model=DeviceReviewResponse)
def create_device_review(
    review: DeviceReviewCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Create a new device review"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify listing exists
    listing = db.query(AssistiveDeviceListing).filter(AssistiveDeviceListing.id == review.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Device listing not found")

    db_review = DeviceReview(**review.dict(), reviewer_id=user.id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/reviews", response_model=List[DeviceReviewResponse])
def get_device_reviews(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all device reviews"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reviews = db.query(DeviceReview).offset(skip).limit(limit).all()
    return reviews