from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
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
import traceback

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
        
    user = db.query(User).filter(User.email == email, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Ensure user has a full_name
    if not user.full_name or user.full_name == "":
        user.full_name = user.username  # Use username as fallback
        db.add(user)
        db.commit()
    
    try:
        # Print the incoming data to help with debugging
        print(f"Creating caregiver listing with service_type: {listing.service_type}, experience_level: {listing.experience_level}")
        
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
    except Exception as e:
        db.rollback()
        print(f"Error creating caregiver listing: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to create listing: {str(e)}")

@router.get("/listings", response_model=PaginatedResponse[CaregiverListingResponse])
def get_caregiver_listings(
    skip: int = 0,
    limit: int = 100,
    service_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    availability_status: Optional[str] = Query(None, description="Filter by availability status: 'available', 'busy', 'unavailable', 'temporarily_unavailable', 'on_vacation', 'limited_availability', 'booked', or empty for all"),
    is_mine: Optional[str] = Query(None, description="Filter for listings created by the current user (true/false)"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get caregiver listings with optional filtering"""
    user = db.query(User).filter(User.email == email, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        query = db.query(CaregiverListing)
        
        # Apply filters only if they have actual values
        if service_type and service_type.strip():
            try:
                # Try to map the string value to enum
                # First try direct mapping
                mapped_service_type = None
                for enum_val in ServiceType:
                    if service_type.upper().replace(' ', '_') == enum_val.name:
                        mapped_service_type = enum_val
                        break
                    # Also try by display value
                    if service_type == enum_val.value:
                        mapped_service_type = enum_val
                        break
                
                if mapped_service_type:
                    query = query.filter(CaregiverListing.service_type == mapped_service_type)
                else:
                    print(f"Warning: Unable to map service_type '{service_type}' to a valid enum value")
            except Exception as e:
                print(f"Error mapping service_type: {str(e)}")
                print(traceback.format_exc())
        
        if experience_level and experience_level.strip():
            try:
                # Try to map the string value to enum
                # First try direct mapping
                mapped_experience_level = None
                for enum_val in ExperienceLevel:
                    if experience_level.upper().replace(' ', '_') == enum_val.name:
                        mapped_experience_level = enum_val
                        break
                    # Also try by display value
                    if experience_level == enum_val.value:
                        mapped_experience_level = enum_val
                        break
                
                if mapped_experience_level:
                    query = query.filter(CaregiverListing.experience_level == mapped_experience_level)
                else:
                    print(f"Warning: Unable to map experience_level '{experience_level}' to a valid enum value")
            except Exception as e:
                print(f"Error mapping experience_level: {str(e)}")
                print(traceback.format_exc())
        
        if location and location.strip():
            query = query.filter(CaregiverListing.location == location)
        
        # Add search functionality if needed
        if search and search.strip():
            search_term = f"%{search.strip()}%"
            query = query.filter(CaregiverListing.description.ilike(search_term))
            
        # Filter by availability status if provided
        if availability_status and availability_status.strip():
            try:
                # Try to map the string value to enum
                mapped_status = None
                for enum_val in AvailabilityStatus:
                    if availability_status.lower() == enum_val.value.lower():
                        mapped_status = enum_val
                        break
                
                if mapped_status:
                    query = query.filter(CaregiverListing.availability_status == mapped_status)
                else:
                    print(f"Warning: Unable to map availability_status '{availability_status}' to a valid enum value")
            except Exception as e:
                print(f"Error mapping availability_status: {str(e)}")
                print(traceback.format_exc())
        
        # Filter by user ID if is_mine=true
        if is_mine and is_mine.lower() == 'true':
            query = query.filter(CaregiverListing.caregiver_id == user.id)
        
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
            "page": (skip // limit) + 1 if limit else 1,
            "size": limit,
            "pages": pages
        }
    except Exception as e:
        print(f"Error in get_caregiver_listings: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

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

@router.patch("/listings/{listing_id}/status", response_model=CaregiverListingResponse)
def update_caregiver_listing_status(
    listing_id: int,
    status: str = Query(..., description="New status: 'available', 'unavailable', 'busy', 'temporarily_unavailable', 'on_vacation', 'limited_availability', 'booked'"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Update the availability status of a caregiver listing"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    listing = db.query(CaregiverListing).filter(CaregiverListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Caregiver listing not found")
    
    if listing.caregiver_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this listing")
    
    # Validate and map status to enum
    try:
        valid_statuses = [status.value for status in AvailabilityStatus]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {', '.join(valid_statuses)}")
            
        mapped_status = None
        for enum_val in AvailabilityStatus:
            if status.lower() == enum_val.value.lower():
                mapped_status = enum_val
                break
        
        if not mapped_status:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {', '.join(valid_statuses)}")
        
        listing.availability_status = mapped_status
        listing.updated_at = datetime.now()
        
        db.add(listing)
        db.commit()
        db.refresh(listing)
        
        return listing
    except Exception as e:
        db.rollback()
        print(f"Error updating caregiver listing status: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to update status: {str(e)}")

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