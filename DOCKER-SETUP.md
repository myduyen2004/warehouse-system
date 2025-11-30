# 🐳 Docker Setup Guide

## Prerequisites

- Docker Desktop installed
- Docker Compose installed
- At least 4GB RAM available

## Quick Start

### Option 1: Using Scripts (Recommended)

**Windows:**
```cmd
# Build everything
build-all.bat

# Start services
start-all.bat

# Stop services
stop-all.bat
```

**Linux/Mac:**
```bash
# Build everything
./build-all.sh

# Start services
./start-all.sh

# Stop services
docker-compose down
```

### Option 2: Using Docker Compose
```bash
# Build and start all services
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Option 3: Using Makefile
```bash
# Build
make build

# Start
make start

# Stop
make stop

# View logs
make logs

# Clean everything
make clean
```

## Services

| Service  | URL                          | Port |
|----------|------------------------------|------|
| Frontend | http://localhost             | 80   |
| Backend  | http://localhost:8080/api    | 8080 |
| Database | localhost:5432               | 5432 |

## Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Manager Account:**
- Username: `manager`
- Password: `manager123`

## Health Checks
```bash
# Frontend health
curl http://localhost/health

# Backend health
curl http://localhost:8080/actuator/health

# Database health
docker exec warehouse-postgres pg_isready -U postgres
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 80
netstat -ano | findstr :80

# Check what's using port 8080
netstat -ano | findstr :8080

# Kill the process (Windows)
taskkill /PID <PID> /F
```

### Frontend Can't Connect to Backend

1. Check if backend is running:
```bash
docker-compose ps backend
```

2. Check backend logs:
```bash
docker-compose logs backend
```

3. Verify environment variables:
```bash
docker-compose exec frontend env | grep VITE_API_BASE_URL
```

### Database Connection Issues

1. Check if database is ready:
```bash
docker-compose logs postgres | grep "ready to accept connections"
```

2. Connect to database:
```bash
docker exec -it warehouse-postgres psql -U postgres -d warehouse_db
```

3. Check tables:
```sql
\dt
```

### Reset Everything
```bash
# Stop and remove all containers, volumes, and images
docker-compose down -v --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

## Development Mode

For development with hot reload:
```bash
# Backend
cd warehouse-backend
./mvnw spring-boot:run

# Frontend
cd warehouse-frontend
npm run dev
```

## Production Deployment

### Build Optimized Images
```bash
docker-compose -f docker-compose.prod.yml build
```

### Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

### View Resource Usage
```bash
docker stats
```

### View Container Details
```bash
docker inspect warehouse-frontend
docker inspect warehouse-backend
docker inspect warehouse-postgres
```

## Backup & Restore

### Backup Database
```bash
docker exec warehouse-postgres pg_dump -U postgres warehouse_db > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker exec -i warehouse-postgres psql -U postgres -d warehouse_db
```

## Scaling
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

## Support

For issues, please check:
1. Docker daemon is running
2. Ports are not in use
3. Sufficient disk space
4. Correct environment variables