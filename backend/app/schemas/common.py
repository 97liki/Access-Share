from typing import TypeVar, Generic, List
from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")

class PaginatedResponse(GenericModel, Generic[T]):
    """Generic paginated response model"""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int

class ApiResponse(BaseModel):
    """Standard API response model"""
    success: bool
    message: str
    data: dict | None = None
