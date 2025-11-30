@echo off
echo ========================================
echo Starting Warehouse Management System
echo ========================================

echo.
echo Starting Docker Compose services...
docker-compose up -d

echo.
echo Waiting for services to be healthy...
timeout /t 30 /nobreak > nul

echo.
echo ========================================
echo Services Status:
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Application URLs:
echo ========================================
echo Frontend: http://localhost
echo Backend API: http://localhost:8080/api
echo Database: localhost:5432
echo ========================================

echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down