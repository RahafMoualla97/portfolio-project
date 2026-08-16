#!/bin/sh

echo "Starting FastAPI application..."

# If DATABASE_URL is set, skip the database wait check
if [ -n "$DATABASE_URL" ]; then
    echo "DATABASE_URL is set, skipping database wait check..."
else
    echo "Waiting for database..."
    while ! nc -z db 5432; do
        sleep 1
    done
    echo "Database is ready!"
fi

# Run database migrations directly with DATABASE_URL
echo "Running migrations..."
alembic upgrade head

# Start FastAPI application
PORT=${PORT:-8000}
echo "Starting FastAPI application on port $PORT..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload