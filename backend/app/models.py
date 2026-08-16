from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Many-to-Many tables
project_technologies = Table(
    'project_technologies',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id', ondelete='CASCADE'), primary_key=True),
    Column('technology_id', Integer, ForeignKey('technologies.id', ondelete='CASCADE'), primary_key=True)
)

project_categories = Table(
    'project_categories',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id', ondelete='CASCADE'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    title = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    profile_image = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    website_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user = relationship("User", back_populates="profile")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    problem_solved = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    sections = relationship("Section", back_populates="project", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="project", cascade="all, delete-orphan")
    videos = relationship("Video", back_populates="project", cascade="all, delete-orphan")
    links = relationship("Link", back_populates="project", cascade="all, delete-orphan")
    technologies = relationship("Technology", secondary=project_technologies, back_populates="projects")
    categories = relationship("Category", secondary=project_categories, back_populates="projects")


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    project = relationship("Project", back_populates="sections")
    images = relationship("Image", back_populates="section", cascade="all, delete-orphan")
    videos = relationship("Video", back_populates="section", cascade="all, delete-orphan")


class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    section_id = Column(Integer, ForeignKey('sections.id', ondelete='CASCADE'), nullable=True)
    url = Column(String(500), nullable=False)
    public_id = Column(String(200), nullable=True)
    alt_text = Column(String(200), nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    project = relationship("Project", back_populates="images")
    section = relationship("Section", back_populates="images")


class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    section_id = Column(Integer, ForeignKey('sections.id', ondelete='CASCADE'), nullable=True)
    url = Column(String(500), nullable=False)
    public_id = Column(String(200), nullable=True)
    title = Column(String(200), nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    project = relationship("Project", back_populates="videos")
    section = relationship("Section", back_populates="videos")


class Link(Base):
    __tablename__ = "links"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    platform_name = Column(String(100), nullable=False)
    url = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    project = relationship("Project", back_populates="links")


class Technology(Base):
    __tablename__ = "technologies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    icon_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    projects = relationship("Project", secondary=project_technologies, back_populates="technologies")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    projects = relationship("Project", secondary=project_categories, back_populates="categories")


class SkillCategory(Base):
    __tablename__ = "skill_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    icon = Column(String(100), nullable=True)
    order = Column(Integer, default=0)
    parent_id = Column(Integer, ForeignKey('skill_categories.id', ondelete='CASCADE'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    skills = relationship("Skill", back_populates="category", cascade="all, delete-orphan")
    children = relationship("SkillCategory", back_populates="parent")
    parent = relationship("SkillCategory", remote_side=[id], back_populates="children")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(100), nullable=True)
    level = Column(Integer, default=0)
    order = Column(Integer, default=0)
    skill_category_id = Column(Integer, ForeignKey('skill_categories.id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    category = relationship("SkillCategory", back_populates="skills")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())