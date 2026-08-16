from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import schemas, crud, auth

router = APIRouter()


# Public endpoints - No authentication required

@router.get("/categories", response_model=List[schemas.CategoryResponse])
def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all project categories.
    
    - Public endpoint accessible to all visitors
    - Supports pagination via skip and limit parameters
    """
    return crud.get_all_categories(db, skip=skip, limit=limit)


@router.get("/categories/{category_id}", response_model=schemas.CategoryResponse)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single category by its ID.
    
    - Public endpoint accessible to all visitors
    - Returns 404 if category does not exist
    """
    category = crud.get_category(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category


# Admin endpoints - Authentication required

@router.post("/admin/categories", response_model=schemas.CategoryResponse)
def create_category(
    category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Create a new category.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Ensures slug uniqueness before creation
    """
    existing = crud.get_category_by_slug(db, category.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists"
        )
    return crud.create_category(db, category)


@router.put("/admin/categories/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
    category_id: int,
    category_update: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update an existing category.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Returns 404 if category does not exist
    """
    category = crud.update_category(db, category_id, category_update)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category


@router.delete("/admin/categories/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a category.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Returns 404 if category does not exist
    """
    if not crud.delete_category(db, category_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return {"message": "Category deleted successfully"}