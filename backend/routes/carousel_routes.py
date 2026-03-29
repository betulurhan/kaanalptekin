from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models import CarouselSlide, CarouselSlideCreate, CarouselSlideUpdate
from auth import verify_token
from datetime import datetime

router = APIRouter(prefix="/carousel", tags=["Carousel"])


def _invalidate():
    try:
        from server import _init_cache
        _init_cache["data"] = None
        _init_cache["ts"] = 0
    except Exception:
        pass


def get_db():
    from server import db
    return db


@router.get("", response_model=List[CarouselSlide])
async def get_carousel_slides(
    active_only: bool = True,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all carousel slides"""
    query = {"is_active": True} if active_only else {}
    slides = await db.carousel_slides.find(query).sort("order", 1).to_list(100)
    return [CarouselSlide(**slide) for slide in slides]


@router.get("/{slide_id}", response_model=CarouselSlide)
async def get_carousel_slide(
    slide_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a single carousel slide by ID"""
    slide = await db.carousel_slides.find_one({"id": slide_id})
    if not slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found"
        )
    return CarouselSlide(**slide)


@router.post("", response_model=CarouselSlide, status_code=status.HTTP_201_CREATED)
async def create_carousel_slide(
    slide_data: CarouselSlideCreate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new carousel slide (admin only)"""
    slide = CarouselSlide(**slide_data.dict())
    await db.carousel_slides.insert_one(slide.dict())
    _invalidate()
    return slide


@router.put("/{slide_id}", response_model=CarouselSlide)
async def update_carousel_slide(
    slide_id: str,
    slide_data: CarouselSlideUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a carousel slide (admin only)"""
    slide = await db.carousel_slides.find_one({"id": slide_id})
    if not slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found"
        )
    
    update_data = {k: v for k, v in slide_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.carousel_slides.update_one(
        {"id": slide_id},
        {"$set": update_data}
    )
    
    updated_slide = await db.carousel_slides.find_one({"id": slide_id})
    _invalidate()
    return CarouselSlide(**updated_slide)


@router.delete("/{slide_id}")
async def delete_carousel_slide(
    slide_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a carousel slide (admin only)"""
    result = await db.carousel_slides.delete_one({"id": slide_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found"
        )
    
    _invalidate()
    return {"message": "Slide deleted successfully"}
