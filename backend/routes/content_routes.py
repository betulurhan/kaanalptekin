from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import AboutContent, AboutContentUpdate, ContactInfo, ContactInfoUpdate, HeroContent, HeroContentUpdate, HeroFeatures, HeroFeaturesUpdate, HeroFeatureItem
from auth import verify_token
from datetime import datetime
import uuid

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



# Hero Features Endpoints (Slider quick links)
@router.get("/hero-features")
async def get_hero_features(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get hero features (quick links on slider)"""
    features = await db.hero_features.find_one()
    if not features:
        # Return default if not exists
        default_features = {
            "id": str(uuid.uuid4()),
            "badge_text": "Profesyonel Gayrimenkul Danışmanlığı",
            "secondary_cta_text": "Bize Ulaşın",
            "secondary_cta_link": "/iletisim",
            "trust_indicators": [
                {"id": str(uuid.uuid4()), "icon": "check-circle", "text": "Lisanslı Danışman", "color": "green", "is_active": True},
                {"id": str(uuid.uuid4()), "icon": "shield", "text": "Güvenli İşlem", "color": "blue", "is_active": True},
                {"id": str(uuid.uuid4()), "icon": "award", "text": "15+ Yıl Tecrübe", "color": "amber", "is_active": True}
            ],
            "card_title": "Hızlı Değerleme",
            "card_subtitle": "Ücretsiz mülk değerlendirme",
            "features": [
                {"id": str(uuid.uuid4()), "icon": "key", "title": "Satılık & Kiralık Portföy", "link": "/projeler", "order": 0, "is_active": True},
                {"id": str(uuid.uuid4()), "icon": "building", "title": "200+ Tamamlanan Proje", "link": "/projeler", "order": 1, "is_active": True},
                {"id": str(uuid.uuid4()), "icon": "map-pin", "title": "Türkiye Geneli Hizmet", "link": "/iletisim", "order": 2, "is_active": True}
            ],
            "cta_text": "Projeleri Keşfet",
            "cta_link": "/projeler",
            "stats_count": "500+",
            "stats_label": "Mutlu Müşteri",
            "rating": "4.9/5",
            "rating_label": "Müşteri Puanı",
            "updated_at": datetime.utcnow()
        }
        await db.hero_features.insert_one(default_features)
        return {k: v for k, v in default_features.items() if k != "_id"}
    return {k: v for k, v in features.items() if k != "_id"}


@router.put("/hero-features")
async def update_hero_features(
    features_data: HeroFeaturesUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update hero features (admin only)"""
    existing = await db.hero_features.find_one()
    
    if not existing:
        # Create default first
        default_features = {
            "id": str(uuid.uuid4()),
            "badge_text": "Profesyonel Gayrimenkul Danışmanlığı",
            "secondary_cta_text": "Bize Ulaşın",
            "secondary_cta_link": "/iletisim",
            "trust_indicators": [],
            "card_title": "Hızlı Değerleme",
            "card_subtitle": "Ücretsiz mülk değerlendirme",
            "features": [],
            "cta_text": "Projeleri Keşfet",
            "cta_link": "/projeler",
            "stats_count": "500+",
            "stats_label": "Mutlu Müşteri",
            "rating": "4.9/5",
            "rating_label": "Müşteri Puanı",
            "updated_at": datetime.utcnow()
        }
        await db.hero_features.insert_one(default_features)
        existing = await db.hero_features.find_one()
    
    update_data = {}
    for k, v in features_data.dict().items():
        if v is not None:
            if k in ["features", "trust_indicators"] and v:
                # Convert to dict format
                update_data[k] = [f.dict() if hasattr(f, 'dict') else f for f in v]
            else:
                update_data[k] = v
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.hero_features.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated = await db.hero_features.find_one({"id": existing["id"]})
    return {k: v for k, v in updated.items() if k != "_id"}
