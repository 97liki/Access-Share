from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class BloodDonationStatus(str, enum.Enum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    PENDING_VERIFICATION = "pending_verification"
    RESERVED = "reserved"
    EXPIRED = "expired"

class BloodDonationRequest(Base):
    __tablename__ = "blood_donation_requests"

    id = Column(Integer, primary_key=True, index=True)
    blood_type = Column(String(3), nullable=False)  # A+, A-, B+, B-, AB+, AB-, O+, O-
    location = Column(String(255), nullable=False)
    urgency = Column(String(10), nullable=False)  # High, Medium, Low
    contact_number = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), nullable=False, default="available")  # available, unavailable, pending_verification, reserved, expired
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User")
    responses = relationship("BloodDonationResponse", back_populates="request")

class BloodDonationResponse(Base):
    __tablename__ = "blood_donation_responses"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("blood_donation_requests.id"), nullable=False)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    donor = relationship("User")
    request = relationship("BloodDonationRequest", back_populates="responses")