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

@router.get("/requests", response_model=List[BloodDonationRequestResponse])
def get_blood_requests(
    skip: int = 0,
    limit: int = 100,
    blood_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
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
    
    if blood_type:
        query = query.filter(BloodDonationRequest.blood_type == blood_type)
    if location:
        query = query.filter(BloodDonationRequest.location == location)
        
    requests = query.offset(skip).limit(limit).all()
    return requests

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

@router.get("/responses", response_model=List[BloodDonationResponseResponse])
def get_blood_responses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    email: str = Header(None, alias="X-User-Email")
):
    """Get all blood donation responses"""
    if not email:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    responses = db.query(BloodDonationResponse).offset(skip).limit(limit).all()
    return responses