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
    """Get all projects with optional filters"""
    query = {}
    if status_filter:
        query["status"] = status_filter
    if type_filter:
        query["type"] = type_filter
    
    projects = await db.projects.find(query).sort("created_at", -1).to_list(100)
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
