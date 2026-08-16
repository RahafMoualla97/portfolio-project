from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import schemas, crud, auth

router = APIRouter()


# Public endpoints - No authentication required

@router.post("/contact", response_model=schemas.MessageResponse)
def create_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db)
):
    """
    Submit a contact message.
    
    - Public endpoint - Anyone can send a message
    - Stores name, email, subject, and message content
    - Initial status is set to unread (is_read: 0)
    """
    return crud.create_message(db, message)


# Admin endpoints - Authentication required

@router.get("/admin/messages", response_model=List[schemas.MessageResponse])
def get_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Retrieve all contact messages.
    
    - Admin only endpoint
    - Returns messages in reverse chronological order (newest first)
    - Supports pagination via skip and limit
    """
    return crud.get_messages(db, skip=skip, limit=limit)


@router.get("/admin/messages/{message_id}", response_model=schemas.MessageResponse)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Retrieve a single message by its ID.
    
    - Admin only endpoint
    - Returns 404 if message does not exist
    """
    message = crud.get_message(db, message_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    return message


@router.put("/admin/messages/{message_id}", response_model=schemas.MessageResponse)
def update_message(
    message_id: int,
    message_update: schemas.MessageUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update a message (e.g., mark as read).
    
    - Admin only endpoint
    - Typically used to set is_read = 1
    - Returns 404 if message does not exist
    """
    message = crud.update_message(db, message_id, message_update)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    return message


@router.delete("/admin/messages/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a message permanently.
    
    - Admin only endpoint
    - Returns 404 if message does not exist
    """
    if not crud.delete_message(db, message_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    return {"message": "Message deleted successfully"}