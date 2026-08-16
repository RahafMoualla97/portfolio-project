#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Run database migrations
echo "Running migrations..."
alembic upgrade head

# Start FastAPI application
# Use PORT from environment or default to 8000
PORT=${PORT:-8000}
echo "Starting FastAPI application on port $PORT..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4 --no-reload