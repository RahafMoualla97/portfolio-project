from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import schemas, crud, auth, models

router = APIRouter()


# Skill categories endpoints

@router.get("/skill-categories", response_model=List[schemas.SkillCategoryResponse])
def get_skill_categories(db: Session = Depends(get_db)):
    """
    Retrieve all skill categories with their associated skills.
    
    - Public endpoint - Accessible to all visitors
    - Returns only top-level categories (parent_id is null)
    - Each category includes its nested skills
    - Ordered by the 'order' field for custom sorting
    """
    categories = db.query(models.SkillCategory).filter(
        models.SkillCategory.parent_id == None
    ).order_by(models.SkillCategory.order).all()
    
    for category in categories:
        category.skills = crud.get_skills_by_category(db, category.id)
    
    return categories


@router.post("/admin/skill-categories", response_model=schemas.SkillCategoryResponse)
def create_skill_category(
    category: schemas.SkillCategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Create a new skill category.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Can be a top-level category or nested under another category
    """
    return crud.create_skill_category(db, category)


@router.put("/admin/skill-categories/{category_id}", response_model=schemas.SkillCategoryResponse)
def update_skill_category(
    category_id: int,
    category_update: schemas.SkillCategoryUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update an existing skill category.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Returns 404 if category does not exist
    """
    category = crud.update_skill_category(db, category_id, category_update)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category


@router.delete("/admin/skill-categories/{category_id}")
def delete_skill_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a skill category.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Cascades to delete all skills within this category
    - Returns 404 if category does not exist
    """
    if not crud.delete_skill_category(db, category_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return {"message": "Category deleted successfully"}


# Skills endpoints

@router.get("/skills", response_model=List[schemas.SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    """
    Retrieve all skills.
    
    - Public endpoint - Accessible to all visitors
    - Returns all skills regardless of category
    - Ordered by the 'order' field for custom sorting
    """
    return crud.get_all_skills(db)


@router.post("/admin/skills", response_model=schemas.SkillResponse)
def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Create a new skill.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Must be associated with a skill category
    """
    return crud.create_skill(db, skill)


@router.put("/admin/skills/{skill_id}", response_model=schemas.SkillResponse)
def update_skill(
    skill_id: int,
    skill_update: schemas.SkillUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update an existing skill.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Returns 404 if skill does not exist
    """
    skill = crud.update_skill(db, skill_id, skill_update)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    return skill


@router.delete("/admin/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a skill.
    
    - Admin only endpoint
    - Requires valid authentication token
    - Returns 404 if skill does not exist
    """
    if not crud.delete_skill(db, skill_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    return {"message": "Skill deleted successfully"}