from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models import Project, ProjectCreate, ProjectUpdate
from auth import verify_token
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["Projects"])


def get_db():
    from server import db
    return db


@router.get("", response_model=List[Project])
async def get_projects(
    status_filter: Optional[str] = None,
    type_filter: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all projects with optional filters, sorted by sort_order"""
    query = {}
    if status_filter:
        query["status"] = status_filter
    if type_filter:
        query["type"] = type_filter
    
    # Sort by sort_order first, then by created_at
    projects = await db.projects.find(query).sort([("sort_order", 1), ("created_at", -1)]).to_list(100)
    return [Project(**project) for project in projects]


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single project by ID"""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return Project(**project)


@router.post("", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new project (admin only)"""
    project = Project(**project_data.dict())
    await db.projects.insert_one(project.dict())
    return project


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a project (admin only)"""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    update_data = {k: v for k, v in project_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.projects.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    updated_project = await db.projects.find_one({"id": project_id})
    return Project(**updated_project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a project (admin only)"""
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return {"message": "Project deleted successfully"}


@router.put("/{project_id}/reorder")
async def reorder_project(
    project_id: str,
    direction: str,  # "up" or "down"
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Move a project up or down in the sort order (admin only)"""
    # Get current project
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    current_order = project.get("sort_order", 0)
    
    # Get all projects sorted
    all_projects = await db.projects.find({}).sort([("sort_order", 1), ("created_at", -1)]).to_list(100)
    
    # Find current index
    current_index = None
    for i, p in enumerate(all_projects):
        if p["id"] == project_id:
            current_index = i
            break
    
    if current_index is None:
        raise HTTPException(status_code=404, detail="Project not found in list")
    
    # Calculate new index
    if direction == "up" and current_index > 0:
        swap_index = current_index - 1
    elif direction == "down" and current_index < len(all_projects) - 1:
        swap_index = current_index + 1
    else:
        return {"message": "Cannot move further"}
    
    # Swap sort_order values
    swap_project = all_projects[swap_index]
    swap_order = swap_project.get("sort_order", 0)
    
    await db.projects.update_one(
        {"id": project_id},
        {"$set": {"sort_order": swap_order, "updated_at": datetime.utcnow()}}
    )
    await db.projects.update_one(
        {"id": swap_project["id"]},
        {"$set": {"sort_order": current_order, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": f"Project moved {direction}"}


@router.post("/reorder-all")
async def reorder_all_projects(
    project_ids: List[str],
    payload: dict = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Reorder all projects based on provided ID list (admin only)"""
    for index, project_id in enumerate(project_ids):
        await db.projects.update_one(
            {"id": project_id},
            {"$set": {"sort_order": index, "updated_at": datetime.utcnow()}}
        )
    
    return {"message": "Projects reordered successfully"}
