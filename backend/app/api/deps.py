import uuid
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import InvalidCredentialsException, PermissionDeniedException
from app.models.user import User, UserRole
from app.schemas.token import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.type != "access" or token_data.sub is None:
            raise InvalidCredentialsException()
    except (JWTError, ValidationError):
        raise InvalidCredentialsException()

    user_id = uuid.UUID(token_data.sub)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise InvalidCredentialsException()
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account.")
    return user

async def get_current_active_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.ADMIN]:
        raise PermissionDeniedException("Administrative privileges required.")
    return current_user

async def get_current_super_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.SUPER_ADMIN:
        raise PermissionDeniedException("Super Administrator privileges required.")
    return current_user
