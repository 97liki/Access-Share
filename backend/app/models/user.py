from sqlalchemy import Boolean, Column, Integer, String, DateTime, text
from sqlalchemy.sql import func
from app.db.base_class import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Add role field with a server_default so it works with existing data
    role = Column(String(50), server_default=text("'user'"), nullable=False)
    
    # Helper properties for authorization checks
    @property
    def is_donor(self):
        return self.role == 'donor' or self.role == 'admin'
    
    @property
    def is_recipient(self):
        return self.role == 'recipient' or self.role == 'admin'
    
    @property
    def is_caregiver(self):
        return self.role == 'caregiver' or self.role == 'admin'
    
    @property
    def is_admin(self):
        return self.role == 'admin'

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)