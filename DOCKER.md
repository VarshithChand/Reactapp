# EduVault Docker Setup

This guide helps you run the EduVault application using Docker.

## Prerequisites

- Docker installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose installed

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL Database** on `localhost:5432`
- **Flask Backend** on `localhost:5000`
- **React Frontend** on `localhost:3000`

### 2. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 3. Stop Services

```bash
docker-compose down
```

## Services

### Database (PostgreSQL)
- Image: postgres:15-alpine
- Username: postgres
- Password: 150711
- Database: myapp
- Port: 5432

### Backend (Flask)
- Runs on port 5000
- Connected to PostgreSQL
- Handles all API requests

### Frontend (React)
- Runs on port 3000
- Built with multi-stage Docker build for optimized image size

## Volumes

- `postgres_data` - Persists database data across restarts

## Environment Variables

The backend uses:
- `DATABASE_URL` - Database connection string (set automatically in docker-compose)
- `FLASK_ENV` - Set to production

## Common Commands

### View logs
```bash
docker-compose logs -f
```

### Rebuild images
```bash
docker-compose up -d --build
```

### Access database
```bash
docker exec -it eduvault_db psql -U postgres -d myapp
```

### Restart specific service
```bash
docker-compose restart backend
```

## Production Deployment

For production, consider:
1. Using environment files (.env)
2. Setting stronger database passwords
3. Using proper SSL/TLS certificates
4. Implementing proper logging
5. Using a reverse proxy (nginx)
