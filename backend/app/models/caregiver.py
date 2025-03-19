from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class ServiceType(str, enum.Enum):
    PERSONAL_CARE = "Personal Care"
    MEDICAL_CARE = "Medical Care"
    EMOTIONAL_SUPPORT = "Emotional Support"
    TRANSPORTATION = "Transportation"
    COMPANIONSHIP = "Companionship"
    HOUSEKEEPING = "Housekeeping"
    SKILLED_NURSING = "Skilled Nursing"
    THERAPY = "Therapy"
    OTHER = "Other"

class ExperienceLevel(str, enum.Enum):
    ENTRY_LEVEL = "Entry Level (0-2 years)"
    INTERMEDIATE = "Intermediate (2-5 years)"
    EXPERIENCED = "Experienced (5-10 years)"
    EXPERT = "Expert (10+ years)"

class AvailabilityStatus(str, enum.Enum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    BUSY = "busy"
    TEMPORARILY_UNAVAILABLE = "temporarily_unavailable"
    ON_VACATION = "on_vacation"
    LIMITED_AVAILABILITY = "limited_availability"
    BOOKED = "booked"

class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"

class ResponseStatus(str, enum.Enum):
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class CaregiverListing(Base):
    __tablename__ = "caregiver_listings"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    experience_level = Column(Enum(ExperienceLevel), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    contact_info = Column(String, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    availability_status = Column(Enum(AvailabilityStatus), nullable=False, default=AvailabilityStatus.AVAILABLE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    caregiver = relationship("User")
    requests = relationship("CaregiverRequest", back_populates="listing")
    reviews = relationship("CaregiverReview", back_populates="listing")

    @property
    def rating(self):
        """Calculate average rating from reviews"""
        if not self.reviews:
            return None
        return sum(review.rating for review in self.reviews) / len(self.reviews)

    @property
    def review_count(self):
        """Get total number of reviews"""
        return len(self.reviews)

class CaregiverRequest(Base):
    __tablename__ = "caregiver_requests"

    id = Column(Integer, primary_key=True, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("caregiver_listings.id"), nullable=False)
    service_type = Column(Enum(ServiceType), nullable=False)
    location = Column(String, nullable=False)
    contact_info = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(RequestStatus), nullable=False, default=RequestStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    receiver = relationship("User")
    listing = relationship("CaregiverListing", back_populates="requests")
    responses = relationship("CaregiverResponse", back_populates="request")

class CaregiverResponse(Base):
    __tablename__ = "caregiver_responses"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("caregiver_requests.id"), nullable=False)
    status = Column(Enum(ResponseStatus), nullable=False)
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    caregiver = relationship("User", foreign_keys=[caregiver_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    request = relationship("CaregiverRequest", back_populates="responses")

class CaregiverReview(Base):
    __tablename__ = "caregiver_reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("caregiver_listings.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    listing = relationship("CaregiverListing", back_populates="reviews")
    reviewer = relationship("User") 