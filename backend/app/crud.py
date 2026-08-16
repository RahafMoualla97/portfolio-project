from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
from .auth import get_password_hash


# User CRUD

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_admin_user(db: Session):
    admin_user = get_user_by_username(db, "admin")
    if not admin_user:
        admin = schemas.UserCreate(
            username="admin",
            email="admin@portfolio.com",
            password="admin123"
        )
        return create_user(db, admin)
    return admin_user


# Profile CRUD

def get_profile(db: Session, user_id: int):
    return db.query(models.Profile).filter(models.Profile.user_id == user_id).first()


def create_or_update_profile(db: Session, user_id: int, profile_data: schemas.ProfileUpdate):
    profile = get_profile(db, user_id)
    if profile:
        update_data = profile_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
        db.commit()
        db.refresh(profile)
        return profile
    else:
        db_profile = models.Profile(user_id=user_id, **profile_data.model_dump())
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile


# Project CRUD

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).order_by(desc(models.Project.created_at)).offset(skip).limit(limit).all()


def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()


def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(
        title=project.title,
        description=project.description,
        problem_solved=project.problem_solved
    )
    if project.category_ids:
        categories = db.query(models.Category).filter(models.Category.id.in_(project.category_ids)).all()
        db_project.categories = categories
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate):
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    update_data = project_update.model_dump(exclude_unset=True, exclude={'category_ids'})
    for key, value in update_data.items():
        setattr(db_project, key, value)
    if project_update.category_ids is not None:
        categories = db.query(models.Category).filter(models.Category.id.in_(project_update.category_ids)).all()
        db_project.categories = categories
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int):
    db_project = get_project(db, project_id)
    if not db_project:
        return False
    db.delete(db_project)
    db.commit()
    return True


# Image CRUD

def create_image(db: Session, image: schemas.ImageCreate):
    db_image = models.Image(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def delete_image(db: Session, image_id: int):
    db_image = db.query(models.Image).filter(models.Image.id == image_id).first()
    if not db_image:
        return False
    db.delete(db_image)
    db.commit()
    return True


def get_images_by_project(db: Session, project_id: int):
    return db.query(models.Image).filter(models.Image.project_id == project_id).order_by(models.Image.order).all()


def get_images_by_section(db: Session, section_id: int):
    return db.query(models.Image).filter(models.Image.section_id == section_id).order_by(models.Image.order).all()


# Video CRUD

def create_video(db: Session, video: schemas.VideoCreate):
    db_video = models.Video(**video.model_dump())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video


def delete_video(db: Session, video_id: int):
    db_video = db.query(models.Video).filter(models.Video.id == video_id).first()
    if not db_video:
        return False
    db.delete(db_video)
    db.commit()
    return True


def get_videos_by_project(db: Session, project_id: int):
    return db.query(models.Video).filter(models.Video.project_id == project_id).order_by(models.Video.order).all()


def get_videos_by_section(db: Session, section_id: int):
    return db.query(models.Video).filter(models.Video.section_id == section_id).order_by(models.Video.order).all()


# Link CRUD

def create_link(db: Session, link: schemas.LinkCreate):
    db_link = models.Link(**link.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


def delete_link(db: Session, link_id: int):
    db_link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if not db_link:
        return False
    db.delete(db_link)
    db.commit()
    return True


def get_links_by_project(db: Session, project_id: int):
    return db.query(models.Link).filter(models.Link.project_id == project_id).all()


# Technology CRUD

def create_technology(db: Session, technology: schemas.TechnologyCreate):
    db_technology = models.Technology(**technology.model_dump())
    db.add(db_technology)
    db.commit()
    db.refresh(db_technology)
    return db_technology


def get_technology_by_name(db: Session, name: str):
    return db.query(models.Technology).filter(models.Technology.name == name).first()


def get_all_technologies(db: Session):
    return db.query(models.Technology).order_by(models.Technology.name).all()


def delete_technology(db: Session, technology_id: int):
    db_technology = db.query(models.Technology).filter(models.Technology.id == technology_id).first()
    if not db_technology:
        return False
    db.delete(db_technology)
    db.commit()
    return True


def add_technology_to_project(db: Session, project_id: int, technology_id: int):
    project = get_project(db, project_id)
    technology = db.query(models.Technology).filter(models.Technology.id == technology_id).first()
    if not project or not technology:
        return None
    if technology not in project.technologies:
        project.technologies.append(technology)
        db.commit()
        db.refresh(project)
    return project


def remove_technology_from_project(db: Session, project_id: int, technology_id: int):
    project = get_project(db, project_id)
    technology = db.query(models.Technology).filter(models.Technology.id == technology_id).first()
    if not project or not technology:
        return None
    if technology in project.technologies:
        project.technologies.remove(technology)
        db.commit()
        db.refresh(project)
    return project


# Category CRUD

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def get_category_by_slug(db: Session, slug: str):
    return db.query(models.Category).filter(models.Category.slug == slug).first()


def get_all_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).order_by(models.Category.name).offset(skip).limit(limit).all()


def update_category(db: Session, category_id: int, category_update: schemas.CategoryUpdate):
    db_category = get_category(db, category_id)
    if not db_category:
        return None
    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if not db_category:
        return False
    db.delete(db_category)
    db.commit()
    return True


# Section CRUD

def create_section(db: Session, section: schemas.SectionCreate):
    db_section = models.Section(**section.model_dump())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section


def get_section(db: Session, section_id: int):
    return db.query(models.Section).filter(models.Section.id == section_id).first()


def update_section(db: Session, section_id: int, section_update: schemas.SectionBase):
    db_section = get_section(db, section_id)
    if not db_section:
        return None
    update_data = section_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_section, key, value)
    db.commit()
    db.refresh(db_section)
    return db_section


def delete_section(db: Session, section_id: int):
    db_section = get_section(db, section_id)
    if not db_section:
        return False
    db.delete(db_section)
    db.commit()
    return True


def get_sections_by_project(db: Session, project_id: int):
    return db.query(models.Section).filter(models.Section.project_id == project_id).order_by(models.Section.order).all()


# Skill Category CRUD

def create_skill_category(db: Session, category: schemas.SkillCategoryCreate):
    db_category = models.SkillCategory(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_skill_category(db: Session, category_id: int):
    return db.query(models.SkillCategory).filter(models.SkillCategory.id == category_id).first()


def get_all_skill_categories(db: Session):
    categories = db.query(models.SkillCategory).order_by(models.SkillCategory.order).all()
    for category in categories:
        category.skills = db.query(models.Skill).filter(models.Skill.skill_category_id == category.id).order_by(models.Skill.order).all()
    return categories


def update_skill_category(db: Session, category_id: int, category_update: schemas.SkillCategoryUpdate):
    db_category = get_skill_category(db, category_id)
    if not db_category:
        return None
    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_skill_category(db: Session, category_id: int):
    db_category = get_skill_category(db, category_id)
    if not db_category:
        return False
    db.delete(db_category)
    db.commit()
    return True


# Skill CRUD

def create_skill(db: Session, skill: schemas.SkillCreate):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


def get_skill(db: Session, skill_id: int):
    return db.query(models.Skill).filter(models.Skill.id == skill_id).first()


def get_skills_by_category(db: Session, category_id: int):
    return db.query(models.Skill).filter(models.Skill.skill_category_id == category_id).order_by(models.Skill.order).all()


def get_all_skills(db: Session):
    return db.query(models.Skill).order_by(models.Skill.order).all()


def update_skill(db: Session, skill_id: int, skill_update: schemas.SkillUpdate):
    db_skill = get_skill(db, skill_id)
    if not db_skill:
        return None
    update_data = skill_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill


def delete_skill(db: Session, skill_id: int):
    db_skill = get_skill(db, skill_id)
    if not db_skill:
        return False
    db.delete(db_skill)
    db.commit()
    return True


# Message CRUD

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_messages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Message).order_by(desc(models.Message.created_at)).offset(skip).limit(limit).all()


def get_message(db: Session, message_id: int):
    return db.query(models.Message).filter(models.Message.id == message_id).first()


def update_message(db: Session, message_id: int, message_update: schemas.MessageUpdate):
    db_message = get_message(db, message_id)
    if not db_message:
        return None
    update_data = message_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_message, key, value)
    db.commit()
    db.refresh(db_message)
    return db_message


def delete_message(db: Session, message_id: int):
    db_message = get_message(db, message_id)
    if not db_message:
        return False
    db.delete(db_message)
    db.commit()
    return True