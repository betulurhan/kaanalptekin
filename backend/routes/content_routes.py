from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import AboutContent, AboutContentUpdate, ContactInfo, ContactInfoUpdate, HeroContent, HeroContentUpdate
from auth import verify_token
from datetime import datetime

router = APIRouter(prefix="/content", tags=["Content Management"])


def get_db():
    from server import db
    return db


# About Content Endpoints
@router.get("/about", response_model=AboutContent)
async def get_about_content(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get about content"""
    content = await db.about_content.find_one()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About content not found"
        )
    return AboutContent(**content)


@router.put("/about", response_model=AboutContent)
async def update_about_content(
    content_data: AboutContentUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update about content (admin only)"""
    existing = await db.about_content.find_one()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About content not found"
        )
    
    update_data = {k: v for k, v in content_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.about_content.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated_content = await db.about_content.find_one({"id": existing["id"]})
    return AboutContent(**updated_content)


# Contact Info Endpoints
@router.get("/contact", response_model=ContactInfo)
async def get_contact_info(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get contact information"""
    info = await db.contact_info.find_one()
    if not info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact info not found"
        )
    return ContactInfo(**info)


@router.put("/contact", response_model=ContactInfo)
async def update_contact_info(
    info_data: ContactInfoUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update contact information (admin only)"""
    existing = await db.contact_info.find_one()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact info not found"
        )
    
    update_data = {k: v for k, v in info_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.contact_info.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated_info = await db.contact_info.find_one({"id": existing["id"]})
    return ContactInfo(**updated_info)


# Hero Content Endpoints
@router.get("/hero", response_model=HeroContent)
async def get_hero_content(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get hero section content"""
    content = await db.hero_content.find_one()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hero content not found"
        )
    return HeroContent(**content)


@router.put("/hero", response_model=HeroContent)
async def update_hero_content(
    content_data: HeroContentUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update hero section content (admin only)"""
    existing = await db.hero_content.find_one()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hero content not found"
        )
    
    update_data = {k: v for k, v in content_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.hero_content.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated_content = await db.hero_content.find_one({"id": existing["id"]})
    return HeroContent(**updated_content)
