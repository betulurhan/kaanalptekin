from fastapi import FastAPI, APIRouter
from fastapi.responses import PlainTextResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime

# Import routes
from routes import auth_routes, project_routes, blog_routes, content_routes, message_routes, upload_routes, carousel_routes


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Gayrimenkul Rehberi API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Gayrimenkul Rehberi API", "status": "running"}

# Sitemap.xml endpoint
@api_router.get("/sitemap.xml", response_class=PlainTextResponse)
async def sitemap():
    """Generate dynamic sitemap.xml"""
    base_url = os.environ.get('SITE_URL', 'https://kaanalptekin.com')
    
    # Get all projects
    projects = await db.projects.find({}, {"id": 1, "updated_at": 1}).to_list(1000)
    
    # Get all blog posts
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
    
    # Add project URLs
    for project in projects:
        lastmod = project.get('updated_at', datetime.utcnow()).strftime('%Y-%m-%d') if isinstance(project.get('updated_at'), datetime) else today
        sitemap_xml += f'''
  <url>
    <loc>{base_url}/projeler/{project['id']}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>'''
    
    # Add blog URLs
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
    base_url = os.environ.get('SITE_URL', 'https://ozpinarlar.com')
    
    robots_txt = f'''User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: {base_url}/api/sitemap.xml
'''
    return robots_txt

# Include all routers
api_router.include_router(auth_routes.router)
api_router.include_router(project_routes.router)
api_router.include_router(blog_routes.router)
api_router.include_router(content_routes.router)
api_router.include_router(message_routes.router)
api_router.include_router(upload_routes.router)
api_router.include_router(carousel_routes.router)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()