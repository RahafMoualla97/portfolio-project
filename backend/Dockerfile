# Docker image configuration for the FastAPI backend application

# ============================================
# BASE IMAGE
# ============================================

# Use Python 3.12 slim image for smaller footprint
FROM python:3.12-slim


# ============================================
# WORK DIRECTORY
# ============================================

# Set working directory inside the container
WORKDIR /app


# ============================================
# SYSTEM DEPENDENCIES
# ============================================

# Install netcat for database health checks
# netcat-openbsd is used in entrypoint.sh to wait for database readiness
RUN apt-get update && \
    apt-get install -y --no-install-recommends netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*


# ============================================
# PYTHON DEPENDENCIES
# ============================================

# Copy requirements file first (for better caching)
COPY requirements.txt .

# Upgrade pip and install Python packages without caching
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ============================================
# APPLICATION CODE
# ============================================

# Copy the entire application code
COPY . .


# ============================================
# NON-ROOT USER (For security)
# ============================================

# Create a non-root user to run the application
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser


# ============================================
# ENTRYPOINT
# ============================================

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]