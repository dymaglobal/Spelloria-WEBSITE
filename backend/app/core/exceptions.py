from fastapi import HTTPException, status

class EntityNotFoundException(HTTPException):
    def __init__(self, entity_name: str, identifier: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity_name} with identifier '{identifier}' was not found."
        )

class EntityAlreadyExistsException(HTTPException):
    def __init__(self, entity_name: str, field: str, value: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{entity_name} with {field} '{value}' already exists."
        )

class InvalidCredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

class PermissionDeniedException(HTTPException):
    def __init__(self, detail: str = "Not enough permissions to perform this operation."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )
