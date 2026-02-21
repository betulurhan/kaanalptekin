from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models import BlogPost, BlogPostCreate, BlogPostUpdate
from auth import verify_token
from datetime import datetime

router = APIRouter(prefix="/blog", tags=["Blog"])


def get_db():
    from server import db
    return db


@router.get("", response_model=List[BlogPost])
async def get_blog_posts(
    category: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all blog posts with optional category filter"""
    query = {}
    if category and category != "Tümü":
        query["category"] = category
    
    posts = await db.blog_posts.find(query).sort("created_at", -1).to_list(100)
    return [BlogPost(**post) for post in posts]


@router.get("/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single blog post by ID"""
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    return BlogPost(**post)


@router.post("", response_model=BlogPost, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    post_data: BlogPostCreate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new blog post (admin only)"""
    # Auto-generate date if not provided
    current_date = datetime.utcnow().strftime("%d %B %Y")
    turkish_months = {
        "January": "Ocak", "February": "Şubat", "March": "Mart",
        "April": "Nisan", "May": "Mayıs", "June": "Haziran",
        "July": "Temmuz", "August": "Ağustos", "September": "Eylül",
        "October": "Ekim", "November": "Kasım", "December": "Aralık"
    }
    for eng, tr in turkish_months.items():
        current_date = current_date.replace(eng, tr)
    
    post = BlogPost(**post_data.dict(), date=current_date)
    await db.blog_posts.insert_one(post.dict())
    return post


@router.put("/{post_id}", response_model=BlogPost)
async def update_blog_post(
    post_id: str,
    post_data: BlogPostUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a blog post (admin only)"""
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    update_data = {k: v for k, v in post_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": update_data}
    )
    
    updated_post = await db.blog_posts.find_one({"id": post_id})
    return BlogPost(**updated_post)


@router.delete("/{post_id}")
async def delete_blog_post(
    post_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a blog post (admin only)"""
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    return {"message": "Blog post deleted successfully"}
