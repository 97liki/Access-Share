from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.session import get_db
from app.models.user import User
from app.models.caregiver import (
    CaregiverListing,
    CaregiverRequest,
    CaregiverResponse,
    CaregiverReview,
    ServiceType,
    ExperienceLevel,
    AvailabilityStatus
)
from app.schemas.caregiver import (
    CaregiverListingCreate,
    CaregiverListingResponse,
    CaregiverRequestCreate,
    CaregiverRequestResponse,
    CaregiverResponseCreate,
    CaregiverResponseResponse,
    CaregiverReviewCreate,
    CaregiverReviewResponse
)
from app.schemas.common import PaginatedResponse
from app.core.auth import get_current_user

# Use auth module for user authentication

router = APIRouter()

# Listing endpoints
@router.post("/listings", response_model=CaregiverListingResponse)
def create_caregiver_listing(
    listing: CaregiverListingCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Create a new caregiver listing"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Ensure user has a full_name
    if not user.full_name or user.full_name == "":
        user.full_name = user.username  # Use username as fallback
        db.add(user)
        db.commit()
    
    # Once the role migration is complete, uncomment this line
    # if not user.is_caregiver:
    #    raise HTTPException(status_code=403, detail="User is not registered as a caregiver")
    
    # Create the database object
    db_listing = CaregiverListing(
        **listing.dict(),
        caregiver_id=user.id
    )
    
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    db_listing.created_at = current_time
    db_listing.updated_at = current_time
    
    # Add, commit, and refresh the object
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.get("/listings", response_model=PaginatedResponse[CaregiverListingResponse])
def get_caregiver_listings(
    skip: int = 0,
    limit: int = 100,
    service_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all caregiver listings"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = db.query(CaregiverListing)
    
    # Apply filters only if they have actual values
    if service_type and service_type.strip():
        query = query.filter(CaregiverListing.service_type == service_type)
    if experience_level and experience_level.strip():
        query = query.filter(CaregiverListing.experience_level == experience_level)
    if location and location.strip():
        query = query.filter(CaregiverListing.location == location)
    # We could add a more complex search here, but for simplicity we'll leave it for now
    
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

@router.get("/listings/{listing_id}", response_model=CaregiverListingResponse)
def read_caregiver_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    listing = db.query(CaregiverListing).filter(
        CaregiverListing.id == listing_id
    ).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver listing not found"
        )
    return listing

# Request endpoints
@router.post("/requests", response_model=CaregiverRequestResponse)
def create_caregiver_request(
    request: CaregiverRequestCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    
    db_request = CaregiverRequest(
        **request.dict(),
        receiver_id=user.id
    )
    db_request.created_at = current_time
    db_request.updated_at = current_time
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=PaginatedResponse[CaregiverRequestResponse])
def read_caregiver_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """
    Get all caregiver requests
    """
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query = db.query(CaregiverRequest)
    
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

@router.get("/requests/{request_id}", response_model=CaregiverRequestResponse)
def read_caregiver_request(
    request_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """
    Get a specific caregiver request by ID
    """
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    request = db.query(CaregiverRequest).filter(CaregiverRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Caregiver request not found")
    return request

# Response endpoints
@router.post("/responses", response_model=CaregiverResponseResponse)
def create_caregiver_response(
    response: CaregiverResponseCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify listing and request exist
    listing = db.query(CaregiverListing).filter(
        CaregiverListing.id == response.listing_id
    ).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver listing not found"
        )
    
    request = db.query(CaregiverRequest).filter(
        CaregiverRequest.id == response.request_id
    ).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver request not found"
        )
    
    db_response = CaregiverResponse(
        **response.dict(),
        caregiver_id=user.id,
        receiver_id=request.receiver_id
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@router.get("/responses", response_model=PaginatedResponse[CaregiverResponseResponse])
def read_caregiver_responses(
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
    
    query = db.query(CaregiverResponse)
    
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

@router.get("/responses/{response_id}", response_model=CaregiverResponseResponse)
def read_caregiver_response(
    response_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    response = db.query(CaregiverResponse).filter(
        CaregiverResponse.id == response_id
    ).first()
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver response not found"
        )
    return response

@router.put("/responses/{response_id}/status", response_model=CaregiverResponseResponse)
def update_response_status(
    response_id: int,
    status: str,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    response = db.query(CaregiverResponse).filter(
        CaregiverResponse.id == response_id
    ).first()
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver response not found"
        )
    
    response.status = status
    db.commit()
    db.refresh(response)
    return response

# Review endpoints
@router.post("/reviews", response_model=CaregiverReviewResponse)
def create_caregiver_review(
    review: CaregiverReviewCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify listing exists
    listing = db.query(CaregiverListing).filter(
        CaregiverListing.id == review.listing_id
    ).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver listing not found"
        )
    
    db_review = CaregiverReview(
        **review.dict(),
        reviewer_id=user.id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update listing rating
    listing_reviews = db.query(CaregiverReview).filter(
        CaregiverReview.listing_id == listing.id
    ).all()
    if listing_reviews:
        listing.rating = sum(r.rating for r in listing_reviews) / len(listing_reviews)
        db.commit()
    
    return db_review

@router.get("/reviews", response_model=PaginatedResponse[CaregiverReviewResponse])
def read_caregiver_reviews(
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
    
    query = db.query(CaregiverReview)
    
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

@router.get("/reviews/{review_id}", response_model=CaregiverReviewResponse)
def read_caregiver_review(
    review_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    review = db.query(CaregiverReview).filter(
        CaregiverReview.id == review_id
    ).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver review not found"
        )
    return review 