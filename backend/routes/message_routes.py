from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models import ContactMessage, ContactMessageCreate
from auth import verify_token

router = APIRouter(prefix="/messages", tags=["Contact Messages"])


def get_db():
    from server import db
    return db


@router.post("", response_model=ContactMessage, status_code=status.HTTP_201_CREATED)
async def create_message(
    message_data: ContactMessageCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new contact message (public endpoint)"""
    message = ContactMessage(**message_data.dict())
    await db.contact_messages.insert_one(message.dict())
    
    # TODO: Send email notification to admin
    
    return message


@router.get("", response_model=List[ContactMessage])
async def get_messages(
    unread_only: bool = False,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all contact messages (admin only)"""
    query = {}
    if unread_only:
        query["is_read"] = False
    
    messages = await db.contact_messages.find(query, {"_id": 0}).sort("created_at", -1).limit(100).to_list(100)
    return [ContactMessage(**msg) for msg in messages]


@router.get("/{message_id}", response_model=ContactMessage)
async def get_message(
    message_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a single message (admin only)"""
    message = await db.contact_messages.find_one({"id": message_id})
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    return ContactMessage(**message)


@router.patch("/{message_id}/read")
async def mark_as_read(
    message_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark a message as read (admin only)"""
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"is_read": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return {"message": "Message marked as read"}


@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a message (admin only)"""
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return {"message": "Message deleted successfully"}


@router.get("/stats/unread-count")
async def get_unread_count(
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get count of unread messages (admin only)"""
    count = await db.contact_messages.count_documents({"is_read": False})
    return {"unread_count": count}
