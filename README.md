# 🚀 Rahaf Moualla — Full-Stack Developer Portfolio

A modern full-stack personal portfolio and content management system built with **FastAPI** and **React**.

This project combines a public developer portfolio with a secure administrative dashboard, allowing portfolio content to be managed dynamically through a RESTful API instead of being hardcoded into the frontend.

It demonstrates practical experience in **Python backend development, REST API design, database management, authentication, media management, React development, and cloud deployment**.

---

## 🌐 Live Demo

| Service | Link |
| --- | --- |
| 🌐 **Portfolio** | [Open Portfolio](https://portfolio-project-indol-nine.vercel.app) |
| ⚡ **Backend API** | [Open API](https://portfolio-backend-vwe1.onrender.com) |
| 📚 **Swagger Documentation** | [Open Swagger UI](https://portfolio-backend-vwe1.onrender.com/docs) |

---

## ✨ Features

### 🎨 Public Portfolio

- Responsive personal portfolio website
- Dynamic profile and About section
- Projects showcase
- Detailed project pages
- Skills and technologies display
- Project images and videos
- External project links
- Contact form
- Responsive navigation
- Light / Dark mode

### 🔐 Admin Dashboard

The application includes a protected administrative dashboard for managing portfolio content.

Administrators can manage:

- Profile information
- Projects
- Project images
- Project videos
- Project links
- Project sections
- Project technologies
- Skills
- Skill categories
- Contact messages
- Portfolio categories

### 🔒 Authentication & Security

- JWT-based authentication
- Protected admin routes
- Authentication context on the frontend
- Protected route handling
- Environment-based configuration
- Separation between public and administrative functionality

### ☁️ Media Management

- Cloudinary integration
- Image management
- Video management
- Project media organization
- Cloud-based media storage

### 🌓 User Experience

- Light / Dark theme
- Persistent theme preference
- Responsive design
- Loading states
- Reusable React components
- Mobile-friendly interface

---

## 🏗️ Architecture

The application follows a full-stack client-server architecture:

```text
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│                  Vite + Tailwind CSS                        │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ REST API / Axios
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       FastAPI API                            │
│              Authentication + CRUD Operations               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ SQLAlchemy
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │
                              ▼
                     ┌─────────────────┐
                     │   Cloudinary    │
                     │  Media Storage  │
                     └─────────────────┘
```

### Application Flow

```text
React Frontend
      │
      │ Axios / REST API
      ▼
FastAPI Routes
      │
      ▼
CRUD Operations
      │
      ▼
SQLAlchemy ORM
      │
      ▼
PostgreSQL
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
| --- | --- |
| **Python** | Backend programming language |
| **FastAPI** | REST API framework |
| **SQLAlchemy** | ORM and database interactions |
| **PostgreSQL** | Relational database |
| **Alembic** | Database migrations |
| **JWT** | Authentication and authorization |
| **Cloudinary** | Image and video storage |
| **Docker** | Containerization |
| **Render** | Backend deployment |

### Frontend

| Technology | Purpose |
| --- | --- |
| **React** | User interface |
| **Vite** | Frontend build tool |
| **Tailwind CSS** | Styling and responsive UI |
| **React Router** | Client-side routing |
| **Axios** | API communication |
| **Font Awesome** | Icons |
| **JavaScript (ES6+)** | Frontend development |

### Infrastructure & Deployment

| Platform / Tool | Purpose |
| --- | --- |
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **Neon** | PostgreSQL hosting |
| **Cloudinary** | Media storage |
| **Docker** | Containerization |
| **Git / GitHub** | Version control |

---

## 📂 Project Structure

The project is organized into two main applications: a **FastAPI backend** and a **React frontend**.

```text
portfolio-project/
│
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   │
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── categories.py
│   │   │   ├── media.py
│   │   │   ├── messages.py
│   │   │   ├── profile.py
│   │   │   ├── projects.py
│   │   │   └── skills.py
│   │   │
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── __init__.py
│   │
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── categories.js
│   │   │   ├── images.js
│   │   │   ├── links.js
│   │   │   ├── messages.js
│   │   │   ├── profile.js
│   │   │   ├── projects.js
│   │   │   ├── sections.js
│   │   │   ├── skills.js
│   │   │   ├── technologies.js
│   │   │   └── videos.js
│   │   │
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   ├── AdminMessages.jsx
│   │   │   │   ├── AdminProfile.jsx
│   │   │   │   ├── AdminProjects.jsx
│   │   │   │   ├── AdminSkills.jsx
│   │   │   │   ├── ProjectImagesManager.jsx
│   │   │   │   ├── ProjectLinksManager.jsx
│   │   │   │   ├── ProjectSectionsManager.jsx
│   │   │   │   ├── ProjectTechnologiesManager.jsx
│   │   │   │   └── ProjectVideosManager.jsx
│   │   │   │
│   │   │   ├── ImageCropper.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── Projects.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

### Backend Structure

- **`app/routes/`** — REST API endpoints grouped by feature.
- **`models.py`** — SQLAlchemy database models.
- **`schemas.py`** — Pydantic request and response schemas.
- **`crud.py`** — Database CRUD operations.
- **`auth.py`** — Authentication and JWT-related functionality.
- **`database.py`** — Database connection and session configuration.
- **`config.py`** — Application configuration and environment settings.
- **`main.py`** — FastAPI application entry point.
- **`alembic/`** — Database migration management.

### Frontend Structure

- **`api/`** — API communication modules.
- **`components/`** — Reusable UI components.
- **`components/admin/`** — Administrative dashboard components.
- **`context/`** — Global authentication and theme state.
- **`pages/`** — Main application pages.
- **`assets/`** — Frontend assets.
- **`public/`** — Public static resources.

---

## 🔌 API Overview

The FastAPI backend provides RESTful endpoints for the main portfolio resources.

| Route Group | Responsibility |
| --- | --- |
| `/auth` | Authentication |
| `/categories` | Category management |
| `/media` | Media operations |
| `/messages` | Contact messages |
| `/profile` | Profile information |
| `/projects` | Project management |
| `/skills` | Skills and skill categories |

### API Documentation

The complete interactive API documentation is available through Swagger UI:

**[Open Swagger Documentation](https://portfolio-backend-vwe1.onrender.com/docs)**

---

## 🗄️ Database & Migrations

The backend uses **PostgreSQL** with **SQLAlchemy** as the ORM.

Database schema changes are managed using **Alembic migrations**.

### Apply Existing Migrations

```bash
alembic upgrade head
```

### Create a New Migration

```bash
alembic revision --autogenerate -m "describe your changes"
```

Alembic keeps database schema changes version-controlled and synchronized with the application.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js 18+
- npm
- PostgreSQL
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/RahafMoualla97/portfolio-project.git
cd portfolio-project
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment.

#### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

#### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create your local environment file from the provided example:

```text
backend/.env
```

Configure the required environment variables in `.env`.

Run the database migrations:

```bash
alembic upgrade head
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create the frontend environment file:

```text
frontend/.env.local
```

Configure the backend API URL:

```text
VITE_API_URL=<your-backend-url>
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

## 🐳 Docker

The project also includes Docker configuration for containerized environments.

Start the application:

```bash
docker-compose up -d
```

Stop the containers:

```bash
docker-compose down
```

---

## 🔐 Environment Variables

Sensitive configuration should **never be committed to GitHub**.

Use local environment files for configuration:

```text
backend/.env
frontend/.env.local
```

Typical backend configuration includes:

```text
DATABASE_URL
SECRET_KEY
ALGORITHM
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Frontend configuration:

```text
VITE_API_URL
```

> Use the exact variable names defined in the project's `.env.example` files.

---

## ☁️ Deployment

The application is deployed using separate services for the frontend, backend, database, and media storage.

```text
                    ┌─────────────────┐
                    │     Vercel      │
                    │ React Frontend  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Render      │
                    │ FastAPI Backend │
                    └──────┬─────┬────┘
                           │     │
                    ┌──────▼─┐ ┌─▼──────────┐
                    │  Neon  │ │ Cloudinary │
                    │Postgres│ │   Media    │
                    └────────┘ └────────────┘
```

### Production Services

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL
- **Media Storage:** Cloudinary

---

## 📱 Responsive Design

The frontend is designed to provide a consistent experience across:

- Desktop
- Laptop
- Tablet
- Mobile

Tailwind CSS and reusable React components are used to build the responsive interface.

---

## 🎯 Project Goals

This project was built to demonstrate practical full-stack development skills, including:

- Designing and developing REST APIs
- Building database-driven applications
- Implementing authentication and protected routes
- Integrating third-party services
- Managing cloud-hosted media
- Building reusable React components
- Connecting a React frontend to a Python backend
- Managing database migrations
- Containerizing applications with Docker
- Deploying full-stack applications to cloud platforms

---

## 📚 Skills Demonstrated

### Backend Development

- Python
- FastAPI
- REST API design
- SQLAlchemy
- PostgreSQL
- Pydantic
- Alembic
- JWT authentication
- CRUD operations
- Environment configuration

### Frontend Development

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Context
- Protected routes
- Responsive UI

### DevOps & Deployment

- Docker
- Git
- GitHub
- Vercel
- Render
- Neon
- Cloudinary

---

## 🔮 Future Improvements

Potential future improvements include:

- Automated backend testing with Pytest
- Frontend testing
- CI/CD pipeline with GitHub Actions
- Improved API validation and error handling
- Rate limiting and additional security controls
- Advanced admin analytics
- Search and filtering improvements
- Improved monitoring and logging

---

## 👩‍💻 About Me

I'm **Rahaf Moualla**, a software developer specializing in **Python backend development, Odoo ERP development, and full-stack applications**.

My focus is on building practical, maintainable software and developing stronger expertise in backend engineering and scalable application architecture.

I'm interested in opportunities related to:

- Python Backend Development
- FastAPI / Django
- Backend Engineering
- Full-Stack Development
- Odoo ERP Development
- Software Engineering

---

## 🔗 Connect With Me

<p align="center">
  <a href="https://www.linkedin.com/in/rahaf-moualla-767111325/">
    <img src="https://img.shields.io/badge/LinkedIn-Rahaf%20Moualla-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://github.com/RahafMoualla97">
    <img src="https://img.shields.io/badge/GitHub-RahafMoualla97-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:rahafmoualla31297@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact%20Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Built with ❤️ by <strong>Rahaf Moualla</strong>
</p>