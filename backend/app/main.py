from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import get_db
from . import crud
from .config import settings
from .routes import auth, projects, media, categories, profile, skills, messages

app = FastAPI(
    title="Portfolio API",
    description="API for managing portfolio projects with skills, categories, and contact messages",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    swagger_ui_parameters={"syntaxHighlight": True}
)

# Update with specific domains in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api", tags=["Projects"])
app.include_router(media.router, prefix="/api", tags=["Media"])
app.include_router(categories.router, prefix="/api", tags=["Categories"])
app.include_router(profile.router, prefix="/api", tags=["Profile"])
app.include_router(skills.router, prefix="/api", tags=["Skills"])
app.include_router(messages.router, prefix="/api", tags=["Messages"])


@app.on_event("startup")
def startup_event():
    # Disabled because we create tables manually via Neon
    # db = next(get_db())
    # crud.create_admin_user(db)
    pass


@app.get("/")
def root():
    return {"message": "Welcome to Portfolio API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}