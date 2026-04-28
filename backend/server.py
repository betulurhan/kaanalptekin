from fastapi import FastAPI, APIRouter
from fastapi.responses import PlainTextResponse
from fastapi.middleware.gzip import GZipMiddleware
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
import uuid
from auth import get_password_hash

# Import routes
from routes import auth_routes, project_routes, blog_routes, content_routes, message_routes, upload_routes, carousel_routes, ilce_routes, cloudinary_routes
from routes import resale_routes, forms_routes, market_trends_routes


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with optimized pool
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(
    mongo_url,
    maxPoolSize=20,
    minPoolSize=5,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
)
db = client[os.environ['DB_NAME']]

# In-memory cache for init data
_init_cache = {"data": None, "ts": 0}
CACHE_TTL = 30  # seconds

app = FastAPI(title="Gayrimenkul Rehberi API")

# GZip compression - MUST be before CORS
app.add_middleware(GZipMiddleware, minimum_size=500)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Gayrimenkul Rehberi API", "status": "running"}

# Health check for Docker
@api_router.get("/health")
async def health_check():
    """Health check endpoint for Docker and monitoring"""
    try:
        # Test MongoDB connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

# Sitemap.xml endpoint
@api_router.get("/sitemap.xml", response_class=PlainTextResponse)
async def sitemap():
    """Generate dynamic sitemap.xml"""
    base_url = os.environ.get('SITE_URL', 'https://kaanalptekin.com')
    projects = await db.projects.find({}, {"id": 1, "updated_at": 1}).to_list(1000)
    blogs = await db.blog_posts.find({}, {"id": 1, "updated_at": 1}).to_list(1000)
    today = datetime.utcnow().strftime('%Y-%m-%d')
    
    sitemap_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{base_url}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>{base_url}/hakkimda</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>{base_url}/projeler</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>{base_url}/blog</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>{base_url}/iletisim</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>'''
    
    for project in projects:
        lastmod = project.get('updated_at', datetime.utcnow()).strftime('%Y-%m-%d') if isinstance(project.get('updated_at'), datetime) else today
        sitemap_xml += f'''
  <url>
    <loc>{base_url}/projeler/{project['id']}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>'''
    
    for blog in blogs:
        lastmod = blog.get('updated_at', datetime.utcnow()).strftime('%Y-%m-%d') if isinstance(blog.get('updated_at'), datetime) else today
        sitemap_xml += f'''
  <url>
    <loc>{base_url}/blog/{blog['id']}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>'''
    
    sitemap_xml += '\n</urlset>'
    return sitemap_xml

# robots.txt endpoint
@api_router.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    """Generate robots.txt"""
    base_url = os.environ.get('SITE_URL', 'https://kaanalptekin.com')
    return f'''User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: {base_url}/api/sitemap.xml
'''

# Include all routers
api_router.include_router(auth_routes.router)
api_router.include_router(project_routes.router)
api_router.include_router(blog_routes.router)
api_router.include_router(content_routes.router)
api_router.include_router(message_routes.router)
api_router.include_router(upload_routes.router)
api_router.include_router(carousel_routes.router)
api_router.include_router(ilce_routes.router)
api_router.include_router(cloudinary_routes.router)
api_router.include_router(resale_routes.router)
api_router.include_router(forms_routes.router)
api_router.include_router(market_trends_routes.router)

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.on_event("startup")
async def startup_tasks():
    """Create indexes and default admin on startup"""
    try:
        # Create MongoDB indexes for fast queries
        await db.projects.create_index("id", unique=True)
        await db.projects.create_index("order")
        await db.projects.create_index("type")
        await db.projects.create_index("status")
        await db.blog_posts.create_index("id", unique=True)
        await db.blog_posts.create_index("category")
        await db.blog_posts.create_index([("created_at", -1)])
        await db.carousel_slides.create_index("is_active")
        await db.carousel_slides.create_index("order")
        await db.users.create_index("username", unique=True)
        await db.messages.create_index([("created_at", -1)])
        await db.ilce_data.create_index("ilce_adi")
        logger.info("MongoDB indexes created/verified")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

    # Create default admin if needed
    try:
        user_count = await db.users.count_documents({})
        if user_count == 0:
            hashed_password = get_password_hash("admin123")
            admin_user = {
                "id": str(uuid.uuid4()),
                "username": "admin",
                "email": "admin@kaanalptekin.com",
                "hashed_password": hashed_password,
                "role": "admin",
                "is_active": True,
                "created_at": datetime.utcnow()
            }
            await db.users.insert_one(admin_user)
            logger.info("Default admin user created: admin / admin123")
        else:
            logger.info(f"Found {user_count} existing users, skipping admin creation")
    except Exception as e:
        logger.error(f"Error creating default admin: {e}")

    # Migrate old local upload URLs to clean state
    try:
        await _migrate_old_local_urls()
    except Exception as e:
        logger.error(f"Error migrating old URLs: {e}")

    # Pre-warm init cache
    try:
        await _warm_init_cache()
        logger.info("Init cache pre-warmed")
    except Exception as e:
        logger.error(f"Error warming cache: {e}")


async def _migrate_old_local_urls():
    """Migrate old /api/upload/files/ URLs in the database.
    On production, local files don't exist (ephemeral containers).
    This replaces broken local URLs with empty string to prevent 404s."""
    import re
    local_pattern = re.compile(r'/api/upload/files/')

    async def fix_string_field(collection_name, field_name):
        """Fix a single string field in a collection"""
        cursor = db[collection_name].find(
            {field_name: {"$regex": "/api/upload/files/"}},
            {"_id": 1, field_name: 1}
        )
        count = 0
        async for doc in cursor:
            file_path = None
            old_url = doc.get(field_name, "")
            if old_url and local_pattern.search(old_url):
                # Try to upload to Cloudinary if file exists locally
                filename = old_url.split("/")[-1]
                local_path = Path(f"/app/backend/uploads/{filename}")
                new_url = ""
                if local_path.exists():
                    try:
                        import cloudinary.uploader
                        result = cloudinary.uploader.upload(
                            str(local_path),
                            folder=f"kaanalptekin/migrated",
                            resource_type="image",
                            transformation=[{"width": 1920, "crop": "limit", "quality": "auto", "fetch_format": "auto"}]
                        )
                        new_url = result["secure_url"]
                        logger.info(f"Migrated {filename} to Cloudinary: {new_url}")
                    except Exception as e:
                        logger.warning(f"Failed to upload {filename} to Cloudinary: {e}")
                await db[collection_name].update_one(
                    {"_id": doc["_id"]},
                    {"$set": {field_name: new_url}}
                )
                count += 1
        if count > 0:
            logger.info(f"Migrated {count} docs in {collection_name}.{field_name}")

    async def fix_array_field(collection_name, field_name):
        """Fix an array of strings field"""
        cursor = db[collection_name].find(
            {field_name: {"$elemMatch": {"$regex": "/api/upload/files/"}}},
            {"_id": 1, field_name: 1}
        )
        count = 0
        async for doc in cursor:
            old_urls = doc.get(field_name, [])
            new_urls = []
            for url in old_urls:
                if isinstance(url, str) and local_pattern.search(url):
                    filename = url.split("/")[-1]
                    local_path = Path(f"/app/backend/uploads/{filename}")
                    if local_path.exists():
                        try:
                            import cloudinary.uploader
                            result = cloudinary.uploader.upload(
                                str(local_path),
                                folder=f"kaanalptekin/migrated",
                                resource_type="image",
                                transformation=[{"width": 1920, "crop": "limit", "quality": "auto", "fetch_format": "auto"}]
                            )
                            new_urls.append(result["secure_url"])
                            logger.info(f"Migrated array item {filename} to Cloudinary")
                            continue
                        except Exception:
                            pass
                    # Skip broken local URLs (don't add empty string to array)
                else:
                    new_urls.append(url)
            await db[collection_name].update_one(
                {"_id": doc["_id"]},
                {"$set": {field_name: new_urls}}
            )
            count += 1
        if count > 0:
            logger.info(f"Migrated {count} docs in {collection_name}.{field_name} (array)")

    # String fields to migrate
    string_fields = [
        ("projects", "main_image"),
        ("blog_posts", "image"),
        ("carousel_slides", "image_url"),
        ("site_settings", "navbar_logo"),
        ("site_settings", "footer_logo"),
        ("about_content", "profile_image"),
    ]
    # Array fields to migrate
    array_fields = [
        ("projects", "images"),
    ]

    for collection_name, field_name in string_fields:
        try:
            await fix_string_field(collection_name, field_name)
        except Exception as e:
            logger.warning(f"Migration skip {collection_name}.{field_name}: {e}")

    for collection_name, field_name in array_fields:
        try:
            await fix_array_field(collection_name, field_name)
        except Exception as e:
            logger.warning(f"Migration skip {collection_name}.{field_name}: {e}")

    logger.info("Local URL migration complete")


async def _warm_init_cache():
    """Pre-fetch and cache init data"""
    import asyncio, json, time
    from bson import ObjectId

    carousel_cursor = db.carousel_slides.find({"is_active": True}, {"_id": 0}).sort("order", 1)
    projects_cursor = db.projects.find({}, {"_id": 0}).sort("order", 1)
    blog_cursor = db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1)

    results = await asyncio.gather(
        db.site_settings.find_one(),
        db.contact_info.find_one(),
        db.seo_settings.find_one(),
        carousel_cursor.to_list(50),
        projects_cursor.to_list(100),
        db.hero_features.find_one(),
        db.home_stats.find_one(),
        db.home_cta.find_one(),
        blog_cursor.to_list(200),
        db.about_content.find_one(),
    )

    site_settings, contact, seo_settings, carousel, projects, hero_features, home_stats, home_cta, blog_posts, about_content = results

    def clean(doc):
        if not doc:
            return None
        return {k: v for k, v in doc.items() if k != "_id"}

    def serialize(obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        raise TypeError(f"Not serializable: {type(obj)}")

    data = {
        "siteSettings": clean(site_settings),
        "contact": clean(contact),
        "seoSettings": clean(seo_settings),
        "carousel": carousel,
        "projects": projects,
        "heroFeatures": clean(hero_features),
        "homeStats": clean(home_stats),
        "homeCTA": clean(home_cta),
        "blogPosts": blog_posts,
        "aboutContent": clean(about_content),
    }
    _init_cache["data"] = json.loads(json.dumps(data, default=serialize))
    _init_cache["ts"] = time.time()


def get_init_cache():
    """Get cached init data or None if expired"""
    import time
    if _init_cache["data"] and (time.time() - _init_cache["ts"]) < CACHE_TTL:
        return _init_cache["data"]
    return None
