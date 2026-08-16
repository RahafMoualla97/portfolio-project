from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import cloudinary
import cloudinary.uploader
import cloudinary.api

from ..database import get_db
from .. import schemas, crud, auth
from ..config import settings

router = APIRouter()


# Cloudinary configuration

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


# Images endpoints

@router.post("/admin/projects/{project_id}/images", response_model=schemas.ImageResponse)
def upload_image(
    project_id: int,
    file: UploadFile = File(...),
    section_id: Optional[int] = Form(None),
    alt_text: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Upload an image for a project or section.
    
    - Admin only endpoint
    - Supports optional section_id for section-specific images
    - Uploads to Cloudinary and stores metadata in database
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if section_id:
        section = crud.get_section(db, section_id)
        if not section or section.project_id != project_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Section not found or does not belong to this project"
            )
    
    try:
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder=f"portfolio/projects/{project_id}/images",
            resource_type="image",
            use_filename=True,
            unique_filename=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
    
    image_data = schemas.ImageCreate(
        project_id=project_id,
        section_id=section_id if section_id else None,
        url=upload_result.get("secure_url"),
        public_id=upload_result.get("public_id"),
        alt_text=alt_text
    )
    return crud.create_image(db, image_data)


@router.delete("/admin/images/{image_id}")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete an image.
    
    - Admin only endpoint
    - Removes from both Cloudinary and database
    """
    image = db.query(crud.models.Image).filter(
        crud.models.Image.id == image_id
    ).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    if image.public_id:
        try:
            cloudinary.uploader.destroy(image.public_id, resource_type="image")
        except Exception as e:
            print(f"Failed to delete from Cloudinary: {str(e)}")
    
    if not crud.delete_image(db, image_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    return {"message": "Image deleted successfully"}


@router.get("/projects/{project_id}/images", response_model=List[schemas.ImageResponse])
def get_project_images(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve all images for a project.
    
    - Public endpoint - No authentication required
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return crud.get_images_by_project(db, project_id)


# Videos endpoints

@router.post("/admin/projects/{project_id}/videos", response_model=schemas.VideoResponse)
def upload_video(
    project_id: int,
    file: UploadFile = File(...),
    section_id: Optional[int] = Form(None),
    title: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Upload a video for a project or section.
    
    - Admin only endpoint
    - Supports optional section_id for section-specific videos
    - Uploads to Cloudinary and stores metadata in database
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if section_id:
        section = crud.get_section(db, section_id)
        if not section or section.project_id != project_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Section not found or does not belong to this project"
            )
    
    try:
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder=f"portfolio/projects/{project_id}/videos",
            resource_type="video",
            use_filename=True,
            unique_filename=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload video: {str(e)}"
        )
    
    video_data = schemas.VideoCreate(
        project_id=project_id,
        section_id=section_id if section_id else None,
        url=upload_result.get("secure_url"),
        public_id=upload_result.get("public_id"),
        title=title
    )
    return crud.create_video(db, video_data)


@router.delete("/admin/videos/{video_id}")
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a video.
    
    - Admin only endpoint
    - Removes from both Cloudinary and database
    """
    video = db.query(crud.models.Video).filter(
        crud.models.Video.id == video_id
    ).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    if video.public_id:
        try:
            cloudinary.uploader.destroy(video.public_id, resource_type="video")
        except Exception as e:
            print(f"Failed to delete from Cloudinary: {str(e)}")
    
    if not crud.delete_video(db, video_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return {"message": "Video deleted successfully"}


@router.get("/projects/{project_id}/videos", response_model=List[schemas.VideoResponse])
def get_project_videos(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve all videos for a project.
    
    - Public endpoint - No authentication required
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return crud.get_videos_by_project(db, project_id)


# Links endpoints

@router.post("/admin/projects/{project_id}/links", response_model=schemas.LinkResponse)
def create_link(
    project_id: int,
    link: schemas.LinkCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Add a link to a project.
    
    - Admin only endpoint
    - Links can point to GitHub, Live Demo, etc.
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    link_data = schemas.LinkCreate(
        project_id=project_id,
        platform_name=link.platform_name,
        url=link.url
    )
    return crud.create_link(db, link_data)


@router.delete("/admin/links/{link_id}")
def delete_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a link from a project.
    
    - Admin only endpoint
    """
    if not crud.delete_link(db, link_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    return {"message": "Link deleted successfully"}


@router.get("/projects/{project_id}/links", response_model=List[schemas.LinkResponse])
def get_project_links(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve all links for a project.
    
    - Public endpoint - No authentication required
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return crud.get_links_by_project(db, project_id)


# Technologies endpoints

@router.post("/admin/technologies", response_model=schemas.TechnologyResponse)
def create_technology(
    technology: schemas.TechnologyCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Create a new technology.
    
    - Admin only endpoint
    - Ensures technology name is unique
    """
    existing = crud.get_technology_by_name(db, technology.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Technology already exists"
        )
    return crud.create_technology(db, technology)


@router.get("/technologies", response_model=List[schemas.TechnologyResponse])
def get_all_technologies(db: Session = Depends(get_db)):
    """
    Retrieve all available technologies.
    
    - Public endpoint - No authentication required
    """
    return crud.get_all_technologies(db)


@router.get("/projects/{project_id}/technologies", response_model=List[schemas.TechnologyResponse])
def get_project_technologies(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve all technologies associated with a project.
    
    - Public endpoint - No authentication required
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project.technologies


@router.delete("/admin/technologies/{technology_id}")
def delete_technology(
    technology_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a technology.
    
    - Admin only endpoint
    """
    if not crud.delete_technology(db, technology_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology not found"
        )
    return {"message": "Technology deleted successfully"}


@router.post("/admin/projects/{project_id}/technologies/{technology_id}")
def add_technology_to_project(
    project_id: int,
    technology_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Associate a technology with a project.
    
    - Admin only endpoint
    - Many-to-many relationship
    """
    project = crud.add_technology_to_project(db, project_id, technology_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project or Technology not found"
        )
    return {"message": "Technology added to project successfully"}


@router.delete("/admin/projects/{project_id}/technologies/{technology_id}")
def remove_technology_from_project(
    project_id: int,
    technology_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Remove a technology association from a project.
    
    - Admin only endpoint
    """
    project = crud.remove_technology_from_project(db, project_id, technology_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project or Technology not found"
        )
    return {"message": "Technology removed from project successfully"}


# Sections endpoints

@router.post("/admin/projects/{project_id}/sections", response_model=schemas.SectionResponse)
def create_section(
    project_id: int,
    section: schemas.SectionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Create a new section within a project.
    
    - Admin only endpoint
    - Sections help organize project content
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    section_data = schemas.SectionCreate(
        project_id=project_id,
        title=section.title,
        description=section.description,
        order=section.order
    )
    return crud.create_section(db, section_data)


@router.put("/admin/sections/{section_id}", response_model=schemas.SectionResponse)
def update_section(
    section_id: int,
    section_update: schemas.SectionBase,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update an existing section.
    
    - Admin only endpoint
    """
    section = crud.update_section(db, section_id, section_update)
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )
    return section


@router.delete("/admin/sections/{section_id}")
def delete_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete a section.
    
    - Admin only endpoint
    - Cascades to delete associated images and videos
    """
    if not crud.delete_section(db, section_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found"
        )
    return {"message": "Section deleted successfully"}


@router.get("/projects/{project_id}/sections", response_model=List[schemas.SectionResponse])
def get_project_sections(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve all sections for a project.
    
    - Public endpoint - No authentication required
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return crud.get_sections_by_project(db, project_id)