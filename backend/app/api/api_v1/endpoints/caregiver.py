from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
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
from app.core.auth import get_current_user

# Use auth module for user authentication

router = APIRouter()

# Listing endpoints
@router.post("/listings", response_model=CaregiverListingResponse)
def create_caregiver_listing(
    listing: CaregiverListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new caregiver listing"""
    if current_user.role != "caregiver":
        raise HTTPException(status_code=403, detail="User is not registered as a caregiver")
    
    db_listing = CaregiverListing(
        **listing.dict(),
        caregiver_id=current_user.id
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.get("/listings", response_model=List[CaregiverListingResponse])
def read_caregiver_listings(
    service_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    location: Optional[str] = None,
    min_hourly_rate: Optional[float] = None,
    max_hourly_rate: Optional[float] = None,
    availability_status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get caregiver listings with filtering and sorting"""
    query = db.query(CaregiverListing)
    
    # Apply filters
    if service_type:
        query = query.filter(CaregiverListing.service_type == service_type)
    if experience_level:
        query = query.filter(CaregiverListing.experience_level == experience_level)
    if location:
        query = query.filter(CaregiverListing.location.ilike(f"%{location}%"))
    if min_hourly_rate is not None:
        query = query.filter(CaregiverListing.hourly_rate >= min_hourly_rate)
    if max_hourly_rate is not None:
        query = query.filter(CaregiverListing.hourly_rate <= max_hourly_rate)
    if availability_status:
        query = query.filter(CaregiverListing.availability_status == availability_status)
    
    # Sort by rating and creation date
    query = query.order_by(CaregiverListing.created_at.desc())
    
    listings = query.offset(skip).limit(limit).all()
    return listings

@router.get("/listings/{listing_id}", response_model=CaregiverListingResponse)
def read_caregiver_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
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
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
    db_request = CaregiverRequest(
        **request.dict(),
        receiver_id=current_user.id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=List[CaregiverRequestResponse])
def read_caregiver_requests(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
    requests = db.query(CaregiverRequest).offset(skip).limit(limit).all()
    return requests

@router.get("/requests/{request_id}", response_model=CaregiverRequestResponse)
def read_caregiver_request(
    request_id: int,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
    request = db.query(CaregiverRequest).filter(
        CaregiverRequest.id == request_id
    ).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver request not found"
        )
    return request

# Response endpoints
@router.post("/responses", response_model=CaregiverResponseResponse)
def create_caregiver_response(
    response: CaregiverResponseCreate,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
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
        caregiver_id=current_user.id,
        receiver_id=request.receiver_id
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@router.get("/responses", response_model=List[CaregiverResponseResponse])
def read_caregiver_responses(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
    responses = db.query(CaregiverResponse).offset(skip).limit(limit).all()
    return responses

@router.get("/responses/{response_id}", response_model=CaregiverResponseResponse)
def read_caregiver_response(
    response_id: int,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
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
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
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
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
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
        reviewer_id=current_user.id
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

@router.get("/reviews", response_model=List[CaregiverReviewResponse])
def read_caregiver_reviews(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
    reviews = db.query(CaregiverReview).offset(skip).limit(limit).all()
    return reviews

@router.get("/reviews/{review_id}", response_model=CaregiverReviewResponse)
def read_caregiver_review(
    review_id: int,
    current_user: User = Depends(get_current_user),  
    db: Session = Depends(get_db)
):
    review = db.query(CaregiverReview).filter(
        CaregiverReview.id == review_id
    ).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caregiver review not found"
        )
    return review 