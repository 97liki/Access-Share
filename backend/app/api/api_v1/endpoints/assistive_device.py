from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
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
from app.schemas.common import PaginatedResponse

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

@router.get("/listings", response_model=PaginatedResponse[AssistiveDeviceListingResponse])
def get_device_listings(
    skip: int = 0,
    limit: int = 100,
    device_type: Optional[str] = None,
    location: Optional[str] = None,
    available: Optional[str] = Query(None, description="Filter by availability status: 'available', 'pending', 'reserved', 'on_hold', 'taken', 'maintenance', 'inactive', or empty for all"),
    is_mine: Optional[str] = Query(None, description="Filter for listings created by the current user (true/false)"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all assistive device listings"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = db.query(AssistiveDeviceListing)
    
    # Apply filters only if they have actual values
    if device_type and device_type.strip():
        query = query.filter(AssistiveDeviceListing.device_type == device_type)
    if location and location.strip():
        query = query.filter(AssistiveDeviceListing.location == location)
    if available and available.strip():
        query = query.filter(AssistiveDeviceListing.available == available)
    if is_mine and is_mine.lower() == 'true':
        query = query.filter(AssistiveDeviceListing.donor_id == user.id)
    
    # Get total count for pagination
    total = query.count()
    
    # Get paginated results
    listings = query.offset(skip).limit(limit).all()
    
    # Calculate total pages
    pages = (total + limit - 1) // limit if limit > 0 else 1
    
    # Construct and return paginated response
    return {
        "items": listings,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }

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

@router.patch("/listings/{listing_id}/status", response_model=AssistiveDeviceListingResponse)
def update_device_listing_status(
    listing_id: int,
    status: str = Header(..., description="New status: 'available', 'pending', 'reserved', 'on_hold', 'taken', 'maintenance', 'inactive'"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Update the availability status of a device listing"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    listing = db.query(AssistiveDeviceListing).filter(AssistiveDeviceListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Device listing not found")
    
    if listing.donor_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this listing")
    
    valid_statuses = ['available', 'pending', 'reserved', 'on_hold', 'taken', 'maintenance', 'inactive']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {', '.join(valid_statuses)}")
    
    listing.available = status
    listing.updated_at = datetime.now()
    
    db.add(listing)
    db.commit()
    db.refresh(listing)
    
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
    
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    db_request.created_at = current_time
    db_request.updated_at = current_time
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=PaginatedResponse[AssistiveDeviceRequestResponse])
def get_device_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """
    Get all assistive device requests
    """
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query = db.query(AssistiveDeviceRequest)
    
    # Get total count for pagination
    total = query.count()
    
    # Get paginated results
    requests = query.offset(skip).limit(limit).all()
    
    # Calculate total pages
    pages = (total + limit - 1) // limit if limit > 0 else 1
    
    # Construct and return paginated response
    return {
        "items": requests,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }

@router.get("/requests/{request_id}", response_model=AssistiveDeviceRequestResponse)
def read_device_request(
    request_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """
    Get a specific assistive device request by ID
    """
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    request = db.query(AssistiveDeviceRequest).filter(AssistiveDeviceRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Assistive device request not found")
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
    
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    db_response.created_at = current_time
    db_response.updated_at = current_time
    
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@router.get("/responses", response_model=PaginatedResponse[AssistiveDeviceResponseResponse])
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

    query = db.query(AssistiveDeviceResponse)
    
    # Fix for null updated_at values
    current_time = datetime.now()
    for response in query.all():
        if not response.updated_at:
            response.updated_at = current_time
            db.add(response)
    db.commit()
    
    # Get total count for pagination
    total = query.count()
    
    # Get paginated results
    responses = query.offset(skip).limit(limit).all()
    
    # Calculate total pages
    pages = (total + limit - 1) // limit if limit > 0 else 1
    
    # Construct and return paginated response
    return {
        "items": responses,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }

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
    
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    db_review.created_at = current_time
    db_review.updated_at = current_time
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/reviews", response_model=PaginatedResponse[DeviceReviewResponse])
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

    query = db.query(DeviceReview)
    
    # Fix for null updated_at values
    current_time = datetime.now()
    for review in query.all():
        if not review.updated_at:
            review.updated_at = current_time
            db.add(review)
    db.commit()
    
    # Get total count for pagination
    total = query.count()
    
    # Get paginated results
    reviews = query.offset(skip).limit(limit).all()
    
    # Calculate total pages
    pages = (total + limit - 1) // limit if limit > 0 else 1
    
    # Construct and return paginated response
    return {
        "items": reviews,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }