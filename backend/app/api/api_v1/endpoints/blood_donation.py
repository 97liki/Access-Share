from fastapi import APIRouter, Depends, HTTPException, Query, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.session import get_db
from app.models.user import User
from app.models.blood_donation import BloodDonationRequest, BloodDonationResponse
from app.schemas.blood_donation import (
    BloodDonationRequestCreate,
    BloodDonationRequestResponse,
    BloodDonationResponseCreate,
    BloodDonationResponseResponse
)
from app.schemas.common import PaginatedResponse

router = APIRouter()

@router.post("/requests", response_model=BloodDonationRequestResponse)
def create_blood_request(
    request: BloodDonationRequestCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Create a new blood donation request"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create the database object
    db_request = BloodDonationRequest(
        blood_type=request.blood_type,
        location=request.location,
        urgency=request.urgency,
        contact_number=request.contact_number,
        notes=request.notes,
        user_id=user.id
    )
    
    # Set created_at and updated_at explicitly
    current_time = datetime.now()
    db_request.created_at = current_time
    db_request.updated_at = current_time
    
    # Add, commit, and refresh the object
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=PaginatedResponse[BloodDonationRequestResponse])
def get_blood_requests(
    skip: int = 0,
    limit: int = 100,
    blood_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    status: Optional[str] = Query(None, description="Filter by status: 'available', 'unavailable', 'pending_verification', 'reserved', 'expired', or empty for all"),
    is_mine: Optional[bool] = Query(None, description="Show only the current user's blood donation requests"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all blood donation requests"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = db.query(BloodDonationRequest)
    
    # Apply filters only if they have actual values
    if blood_type and blood_type.strip():
        query = query.filter(BloodDonationRequest.blood_type == blood_type)
    if location and location.strip():
        query = query.filter(BloodDonationRequest.location == location)
    if status and status.strip():
        query = query.filter(BloodDonationRequest.status == status)
    # Filter by current user's blood donation requests if is_mine is true
    if is_mine:
        query = query.filter(BloodDonationRequest.user_id == user.id)
        
    # Fix for null updated_at values
    current_time = datetime.now()
    for request in query.all():
        if not request.updated_at:
            request.updated_at = current_time
            db.add(request)
    db.commit()
    
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

@router.get("/requests/{request_id}", response_model=BloodDonationRequestResponse)
def read_blood_request(
    request_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """
    Get a specific blood donation request by ID
    """
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    request = db.query(BloodDonationRequest).filter(BloodDonationRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Blood donation request not found")
    
    # Check if user is authorized to view this request
    if request.user_id != user.id:
        # Check if user is a donor and the request is available
        if not user.is_donor or request.status != 'available':
            raise HTTPException(status_code=403, detail="Not authorized to view this request")
    
    return request

@router.post("/responses", response_model=BloodDonationResponseResponse)
def create_blood_response(
    response: BloodDonationResponseCreate,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Create a new blood donation response"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Once the role migration is complete, uncomment this line
    # if not user.is_donor:
    #    raise HTTPException(status_code=403, detail="User is not registered as a donor")

    # Verify request exists
    request = db.query(BloodDonationRequest).filter(BloodDonationRequest.id == response.request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Blood donation request not found")

    db_response = BloodDonationResponse(
        request_id=response.request_id,
        donor_id=user.id,
        message=response.message,
        status="pending"
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@router.get("/responses", response_model=PaginatedResponse[BloodDonationResponseResponse])
def get_blood_responses(
    skip: int = 0,
    limit: int = 100,
    is_mine: Optional[bool] = Query(None, description="Show only the current user's blood donation responses"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all blood donation responses"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = db.query(BloodDonationResponse)
    
    # Filter by current user's responses if is_mine is true
    if is_mine:
        query = query.filter(BloodDonationResponse.donor_id == user.id)
    
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

@router.delete("/requests/{request_id}", response_model=None)
def delete_blood_request(
    request_id: int,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Delete a blood donation request"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    request = db.query(BloodDonationRequest).filter(BloodDonationRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Blood donation request not found")
    
    if request.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this request")
    
    db.delete(request)
    db.commit()
    return {"message": "Blood donation request deleted successfully"}

@router.patch("/requests/{request_id}/status", response_model=BloodDonationRequestResponse)
def update_blood_request_status(
    request_id: int,
    status: str = Query(..., description="New status: 'available', 'unavailable', 'pending_verification', 'reserved', 'expired'"),
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Update the status of a blood donation request"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    request = db.query(BloodDonationRequest).filter(BloodDonationRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Blood donation request not found")
    
    if request.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this request")
    
    # Add status field if it doesn't exist
    if not hasattr(request, 'status'):
        raise HTTPException(status_code=500, detail="Status field not available on this model")
    
    valid_statuses = ['available', 'unavailable', 'pending_verification', 'reserved', 'expired']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {', '.join(valid_statuses)}")
    
    # Validate status transitions
    invalid_transitions = {
        'expired': ['available', 'pending_verification'],  # Can't reactivate expired requests
        'reserved': ['available'],  # Can't make reserved requests available
    }
    
    if request.status in invalid_transitions and status in invalid_transitions[request.status]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{request.status}' to '{status}'"
        )
    
    request.status = status
    request.updated_at = datetime.now()
    
    db.add(request)
    db.commit()
    db.refresh(request)
    
    return request