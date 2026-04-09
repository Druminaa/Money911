from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
import re

# ── Auth ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        # Count uppercase letters
        uppercase_count = sum(1 for c in v if c.isupper())
        if uppercase_count != 1:
            raise ValueError('Password must contain exactly one uppercase letter')
        
        # Check for at least one lowercase letter
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        
        # Check for at least one special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;\'/`~]', v):
            raise ValueError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=[]\\;\'`~)')
        
        # Check for at least one number
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# ── User ──────────────────────────────────────────────
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    currency: Optional[str] = None
    profile_image: Optional[str] = None  # base64 string

# ── Transaction ───────────────────────────────────────
class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: str  # income | expense
    category: str
    date: str

# ── Budget ────────────────────────────────────────────
class BudgetCreate(BaseModel):
    category: str
    amount: float
    period: str  # Monthly | Yearly

# ── Goal ──────────────────────────────────────────────
class GoalCreate(BaseModel):
    title: str
    category: str
    target_amount: float
    current_amount: float = 0.0
    deadline: Optional[str] = None

class GoalUpdate(BaseModel):
    current_amount: Optional[float] = None
    title: Optional[str] = None

# ── Cash ──────────────────────────────────────────────
class CashCreate(BaseModel):
    type: str  # in | out
    amount: float
    category: str
    note: Optional[str] = ""

# ── Loan ──────────────────────────────────────────────
class LoanCreate(BaseModel):
    type: str  # lend | borrow
    name: str
    amount: float
    interest_rate: float
    duration: str
    purpose: str
