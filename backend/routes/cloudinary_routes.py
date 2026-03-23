from fastapi import APIRouter, Query, HTTPException, Depends, UploadFile, File
import cloudinary
import cloudinary.uploader
import cloudinary.utils
import os
import time
from auth import verify_token

router = APIRouter(prefix="/cloudinary", tags=["Cloudinary"])

# Initialize Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

ALLOWED_FOLDERS = ("logos", "projects", "blog", "about", "carousel", "uploads")


@router.get("/signature")
async def generate_signature(
    resource_type: str = Query("image", enum=["image", "video"]),
    folder: str = Query("uploads"),
    payload: dict = Depends(verify_token)
):
    """Generate signed upload params for direct browser upload to Cloudinary"""
    
    # Validate folder
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(status_code=400, detail=f"Invalid folder. Allowed: {ALLOWED_FOLDERS}")
    
    timestamp = int(time.time())
    
    # Transformation for auto-optimization
    eager = "c_limit,w_1920,q_auto,f_auto"
    
    params = {
        "timestamp": timestamp,
        "folder": f"kaanalptekin/{folder}",
        "resource_type": resource_type,
        "eager": eager,
        "eager_async": True
    }
    
    signature = cloudinary.utils.api_sign_request(
        params,
        os.getenv("CLOUDINARY_API_SECRET")
    )
    
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "api_key": os.getenv("CLOUDINARY_API_KEY"),
        "folder": f"kaanalptekin/{folder}",
        "resource_type": resource_type,
        "eager": eager
    }


@router.post("/upload")
async def upload_to_cloudinary(
    file: UploadFile = File(...),
    folder: str = Query("uploads"),
    payload: dict = Depends(verify_token)
):
    """Direct backend upload to Cloudinary (for simplicity)"""
    
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(status_code=400, detail=f"Invalid folder. Allowed: {ALLOWED_FOLDERS}")
    
    # Check file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPG, PNG, GIF, WEBP")
    
    # Check file size (max 10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")
    
    try:
        # Upload to Cloudinary with optimizations
        result = cloudinary.uploader.upload(
            contents,
            folder=f"kaanalptekin/{folder}",
            resource_type="image",
            transformation=[
                {"width": 1920, "crop": "limit", "quality": "auto", "fetch_format": "auto"}
            ],
            eager=[
                {"width": 400, "height": 300, "crop": "fill", "quality": "auto", "fetch_format": "auto"},
                {"width": 800, "crop": "limit", "quality": "auto", "fetch_format": "auto"}
            ],
            eager_async=True
        )
        
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "width": result.get("width"),
            "height": result.get("height"),
            "format": result.get("format"),
            "thumbnail": result["secure_url"].replace("/upload/", "/upload/c_fill,w_400,h_300,q_auto,f_auto/")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/delete")
async def delete_from_cloudinary(
    public_id: str = Query(...),
    payload: dict = Depends(verify_token)
):
    """Delete an image from Cloudinary"""
    
    try:
        result = cloudinary.uploader.destroy(public_id, invalidate=True)
        return {"message": "Deleted", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


def get_optimized_url(url: str, width: int = None, height: int = None, crop: str = "limit") -> str:
    """Helper function to generate optimized Cloudinary URLs"""
    if not url or "cloudinary" not in url:
        return url
    
    transformations = ["q_auto", "f_auto"]
    
    if width:
        transformations.append(f"w_{width}")
    if height:
        transformations.append(f"h_{height}")
    if crop:
        transformations.append(f"c_{crop}")
    
    transform_str = ",".join(transformations)
    return url.replace("/upload/", f"/upload/{transform_str}/")
