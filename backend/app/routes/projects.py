from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import schemas, crud, auth

router = APIRouter()


# Public endpoints - No authentication required

@router.get("/projects", response_model=List[schemas.ProjectResponse])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all projects with pagination.
    
    - Public endpoint - Accessible to all visitors
    - Returns projects sorted by creation date (newest first)
    - Supports pagination via skip and limit parameters
    - Includes all related data: images, videos, links, technologies, sections
    """
    return crud.get_projects(db, skip=skip, limit=limit)


@router.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single project by its ID with all related data.
    
    - Public endpoint - Accessible to all visitors
    - Returns complete project details including sections, media, and metadata
    - Returns 404 if project does not exist
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


# Admin endpoints - Authentication required

@router.post("/admin/projects", response_model=schemas.ProjectResponse)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Create a new project.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Accepts project details including category associations
    """
    return crud.create_project(db, project)


@router.put("/admin/projects/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update an existing project.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Returns 404 if project does not exist
    - Supports partial updates (only provided fields are updated)
    """
    project = crud.update_project(db, project_id, project_update)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


@router.delete("/admin/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a project permanently.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Cascades to delete associated sections, images, videos, and links
    - Returns 404 if project does not exist
    """
    if not crud.delete_project(db, project_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return {"message": "Project deleted successfully"}