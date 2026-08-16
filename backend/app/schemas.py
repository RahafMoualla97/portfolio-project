from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Authentication Schemas

class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: int
    created_at: datetime
    profile: Optional['ProfileResponse'] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str


# Profile Schemas

class ProfileBase(BaseModel):
    title: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    website_url: Optional[str] = None


class ProfileCreate(ProfileBase):
    user_id: int


class ProfileUpdate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Media Schemas

class ImageBase(BaseModel):
    url: str
    public_id: Optional[str] = None
    alt_text: Optional[str] = None
    order: Optional[int] = 0


class ImageCreate(ImageBase):
    project_id: int
    section_id: Optional[int] = None


class ImageResponse(ImageBase):
    id: int
    project_id: int
    section_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class VideoBase(BaseModel):
    url: str
    public_id: Optional[str] = None
    title: Optional[str] = None
    order: Optional[int] = 0


class VideoCreate(VideoBase):
    project_id: int
    section_id: Optional[int] = None


class VideoResponse(VideoBase):
    id: int
    project_id: int
    section_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LinkBase(BaseModel):
    platform_name: str
    url: str


class LinkCreate(LinkBase):
    project_id: Optional[int] = None


class LinkResponse(LinkBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TechnologyBase(BaseModel):
    name: str
    icon_url: Optional[str] = None


class TechnologyCreate(TechnologyBase):
    pass


class TechnologyResponse(TechnologyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Category Schemas

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Section Schemas

class SectionBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: Optional[int] = 0


class SectionCreate(SectionBase):
    project_id: int


class SectionResponse(SectionBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[ImageResponse] = []
    videos: List[VideoResponse] = []

    class Config:
        from_attributes = True


# Project Schemas

class ProjectBase(BaseModel):
    title: str
    description: str
    problem_solved: Optional[str] = None


class ProjectCreate(ProjectBase):
    category_ids: Optional[List[int]] = []


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    problem_solved: Optional[str] = None
    category_ids: Optional[List[int]] = []


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[ImageResponse] = []
    videos: List[VideoResponse] = []
    links: List[LinkResponse] = []
    technologies: List[TechnologyResponse] = []
    sections: List[SectionResponse] = []
    categories: List[CategoryResponse] = []

    class Config:
        from_attributes = True


# Skill Category Schemas

class SkillCategoryBase(BaseModel):
    name: str
    icon: Optional[str] = None
    order: Optional[int] = 0
    parent_id: Optional[int] = None


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillCategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    parent_id: Optional[int] = None


class SkillCategoryResponse(SkillCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    children: List['SkillCategoryResponse'] = []

    class Config:
        from_attributes = True


# Skill Schemas

class SkillBase(BaseModel):
    name: str
    icon: Optional[str] = None
    level: Optional[int] = 0
    order: Optional[int] = 0
    skill_category_id: int


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    level: Optional[int] = None
    order: Optional[int] = None
    skill_category_id: Optional[int] = None


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[SkillCategoryResponse] = None

    class Config:
        from_attributes = True


# Message Schemas

class MessageBase(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


class MessageCreate(MessageBase):
    pass


class MessageResponse(MessageBase):
    id: int
    is_read: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MessageUpdate(BaseModel):
    is_read: Optional[int] = None


SkillCategoryResponse.model_rebuild()
UserResponse.model_rebuild()