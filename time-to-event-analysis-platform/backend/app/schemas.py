from typing import Any
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    domain: str = "generic"
    config: dict[str, Any] = {}
    data: list[dict[str, Any]] = []

class ProjectUpdate(BaseModel):
    name: str | None = None
    domain: str | None = None
    config: dict[str, Any] | None = None
    data: list[dict[str, Any]] | None = None
