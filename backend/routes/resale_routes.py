from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid
from auth import get_current_user
from database import db

router = APIRouter(prefix="/resale", tags=["Resale Listings"])

class ResaleListingBase(BaseModel):
    title: str
    property_type: str  # Daire, Villa, Arsa, Dükkan, Ofis
    listing_type: str  # sale, rent
    location: str
    district: str
    address: Optional[str] = None
    price: str
    area_m2: Optional[int] = None
    rooms: Optional[str] = None
    bathrooms: Optional[int] = None
    floor: Optional[str] = None
    building_age: Optional[str] = None
    has_elevator: Optional[bool] = False
    parking: Optional[str] = None
    heating: Optional[str] = None
    features: List[str] = []
    description: Optional[str] = None
    image: Optional[str] = None
    images: List[str] = []
    is_active: bool = True

class ResaleListingCreate(ResaleListingBase):
    pass

class ResaleListingUpdate(BaseModel):
    title: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    price: Optional[str] = None
    area_m2: Optional[int] = None
    rooms: Optional[str] = None
    bathrooms: Optional[int] = None
    floor: Optional[str] = None
    building_age: Optional[str] = None
    has_elevator: Optional[bool] = None
    parking: Optional[str] = None
    heating: Optional[str] = None
    features: Optional[List[str]] = None
    description: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None

class ResaleListing(ResaleListingBase):
    id: str
    created_at: datetime
    updated_at: datetime

@router.get("", response_model=List[ResaleListing])
async def get_resale_listings(
    type_filter: Optional[str] = None,
    location_filter: Optional[str] = None,
    listing_type: Optional[str] = None,
    active_only: bool = True
):
    query = {}
    if active_only:
        query["is_active"] = True
    if type_filter:
        query["property_type"] = type_filter
    if location_filter:
        query["district"] = location_filter
    if listing_type:
        query["listing_type"] = listing_type
    
    listings = await db.resale_listings.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return listings

@router.get("/{listing_id}", response_model=ResaleListing)
async def get_resale_listing(listing_id: str):
    listing = await db.resale_listings.find_one({"id": listing_id}, {"_id": 0})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.post("", response_model=ResaleListing)
async def create_resale_listing(listing: ResaleListingCreate, current_user: dict = Depends(get_current_user)):
    listing_dict = listing.dict()
    listing_dict["id"] = str(uuid.uuid4())
    listing_dict["created_at"] = datetime.utcnow()
    listing_dict["updated_at"] = datetime.utcnow()
    
    await db.resale_listings.insert_one(listing_dict)
    return {k: v for k, v in listing_dict.items() if k != "_id"}

@router.put("/{listing_id}", response_model=ResaleListing)
async def update_resale_listing(listing_id: str, listing: ResaleListingUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in listing.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.resale_listings.update_one(
        {"id": listing_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    updated = await db.resale_listings.find_one({"id": listing_id}, {"_id": 0})
    return updated

@router.delete("/{listing_id}")
async def delete_resale_listing(listing_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.resale_listings.delete_one({"id": listing_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Listing deleted successfully"}
