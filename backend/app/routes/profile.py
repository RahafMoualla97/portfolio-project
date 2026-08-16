from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud, auth

router = APIRouter()


# Public endpoints - No authentication required

@router.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    """
    Retrieve the public profile information.
    
    - Public endpoint - Accessible to all visitors
    - Returns profile data including bio, title, and social links
    - Returns 404 if no profile exists
    """
    profile = db.query(crud.models.Profile).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile


# Admin endpoints - Authentication required

@router.put("/admin/profile", response_model=schemas.ProfileResponse)
def update_profile(
    profile_data: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Update profile information.
    
    - Admin only endpoint
    - Updates title, bio, and social media links
    - Creates profile if it doesn't exist
    """
    return crud.create_or_update_profile(db, current_user.id, profile_data)


@router.post("/admin/profile/image", response_model=schemas.ProfileResponse)
def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Upload a profile image.
    
    - Admin only endpoint
    - Uploads image to Cloudinary
    - Updates profile with the new image URL
    """
    import cloudinary
    import cloudinary.uploader
    
    try:
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder="portfolio/profile",
            resource_type="image",
            use_filename=True,
            unique_filename=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
    
    profile_data = schemas.ProfileUpdate(
        profile_image=upload_result.get("secure_url")
    )
    return crud.create_or_update_profile(db, current_user.id, profile_data)


@router.delete("/admin/profile/image", response_model=schemas.ProfileResponse)
def delete_profile_image(
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    """
    Delete the current profile image.
    
    - Admin only endpoint
    - Removes image from Cloudinary
    - Updates profile to remove image URL
    """
    profile = crud.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    if profile.profile_image:
        import cloudinary
        import cloudinary.uploader
        try:
            public_id = profile.profile_image.split('/')[-1].split('.')[0]
            cloudinary.uploader.destroy(
                f"portfolio/profile/{public_id}",
                resource_type="image"
            )
        except Exception as e:
            print(f"Failed to delete from Cloudinary: {str(e)}")
    
    profile_data = schemas.ProfileUpdate(profile_image=None)
    return crud.create_or_update_profile(db, current_user.id, profile_data)