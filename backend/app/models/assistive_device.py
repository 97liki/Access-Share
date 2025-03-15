from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class AssistiveDeviceListing(Base):
    __tablename__ = "assistive_device_listings"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_name = Column(String(255), nullable=False)
    device_type = Column(String(100), nullable=False)
    condition = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    contact_info = Column(String(100), nullable=False)
    available = Column(String(20), nullable=False, default="available")  # available, pending, taken
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    donor = relationship("User")
    requests = relationship("AssistiveDeviceRequest", back_populates="listing")
    responses = relationship("AssistiveDeviceResponse", back_populates="listing")
    reviews = relationship("DeviceReview", back_populates="listing")

class AssistiveDeviceRequest(Base):
    __tablename__ = "assistive_device_requests"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("assistive_device_listings.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    receiver = relationship("User")
    listing = relationship("AssistiveDeviceListing", back_populates="requests")
    responses = relationship("AssistiveDeviceResponse", back_populates="request")

class AssistiveDeviceResponse(Base):
    __tablename__ = "assistive_device_responses"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("assistive_device_requests.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("assistive_device_listings.id"), nullable=False)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    donor = relationship("User")
    request = relationship("AssistiveDeviceRequest", back_populates="responses")
    listing = relationship("AssistiveDeviceListing", back_populates="responses")

class DeviceReview(Base):
    __tablename__ = "device_reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("assistive_device_listings.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    reviewer = relationship("User")
    listing = relationship("AssistiveDeviceListing", back_populates="reviews")