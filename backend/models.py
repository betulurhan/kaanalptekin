from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid


# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Project Models
class ProjectUnit(BaseModel):
    unit_number: str
    floor: int
    rooms: str  # e.g., "2+1", "3+1"
    area_m2: float
    price: str
    status: str  # "available" or "sold"

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    location: str
    type: str
    status: str  # completed or ongoing
    image: str
    images: Optional[List[str]] = []  # Multiple images for gallery
    description: str
    price: str
    features: List[str]
    completion_date: str
    payment_plan: Optional[str] = None
    floor_plan: Optional[str] = None  # Floor plan image URL
    units: Optional[List[ProjectUnit]] = []  # List of units/apartments
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    location: str
    type: str
    status: str
    image: str
    images: Optional[List[str]] = []
    description: str
    price: str
    features: List[str]
    completion_date: str
    payment_plan: Optional[str] = None
    floor_plan: Optional[str] = None
    units: Optional[List[ProjectUnit]] = []

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    price: Optional[str] = None
    features: Optional[List[str]] = None
    completion_date: Optional[str] = None
    payment_plan: Optional[str] = None
    floor_plan: Optional[str] = None
    units: Optional[List[ProjectUnit]] = None


# Blog Models
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    date: str
    category: str
    image: str
    author: str
    read_time: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    image: str
    author: str
    read_time: str

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    author: Optional[str] = None
    read_time: Optional[str] = None


# About Content Model
class AboutContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    short_bio: str
    full_bio: str
    experience: str
    completed_projects: str
    happy_clients: str
    image: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AboutContentUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    short_bio: Optional[str] = None
    full_bio: Optional[str] = None
    experience: Optional[str] = None
    completed_projects: Optional[str] = None
    happy_clients: Optional[str] = None
    image: Optional[str] = None


# Contact Info Model
class ContactInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str
    email: EmailStr
    address: str
    working_hours: str
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContactInfoUpdate(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    working_hours: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None


# Hero Content Model
class HeroContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    description: str
    image: str
    cta_primary_text: str
    cta_secondary_text: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class HeroContentUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    cta_primary_text: Optional[str] = None
    cta_secondary_text: Optional[str] = None


# Contact Message Model
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


# Carousel/Slider Model
class CarouselSlide(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CarouselSlideCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order: int = 0
    is_active: bool = True

class CarouselSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None



# Hero Features Model (Quick links on slider)
class HeroFeatureItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    icon: str  # icon name: home, key, building, map-pin, etc.
    title: str
    link: str
    order: int = 0
    is_active: bool = True

class TrustIndicator(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    icon: str  # check-circle, shield, award, etc.
    text: str
    color: str = "green"  # green, blue, amber
    is_active: bool = True

class HeroFeatures(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Badge
    badge_text: str = "Profesyonel Gayrimenkul Danışmanlığı"
    # Secondary CTA Button
    secondary_cta_text: str = "Bize Ulaşın"
    secondary_cta_link: str = "/iletisim"
    # Trust Indicators
    trust_indicators: List[TrustIndicator] = []
    # Card Settings
    card_title: str = "Hızlı Değerleme"
    card_subtitle: str = "Ücretsiz mülk değerlendirme"
    features: List[HeroFeatureItem] = []
    cta_text: str = "Projeleri Keşfet"
    cta_link: str = "/projeler"
    stats_count: str = "500+"
    stats_label: str = "Mutlu Müşteri"
    rating: str = "4.9/5"
    rating_label: str = "Müşteri Puanı"
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class HeroFeaturesUpdate(BaseModel):
    badge_text: Optional[str] = None
    secondary_cta_text: Optional[str] = None
    secondary_cta_link: Optional[str] = None
    trust_indicators: Optional[List[TrustIndicator]] = None
    card_title: Optional[str] = None
    card_subtitle: Optional[str] = None
    features: Optional[List[HeroFeatureItem]] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    stats_count: Optional[str] = None
    stats_label: Optional[str] = None
    rating: Optional[str] = None
    rating_label: Optional[str] = None

