@echo off
echo ========================================
echo Building Warehouse Management System
echo ========================================

echo.
echo [1/3] Building Backend...
cd warehouse-backend
call mvnw clean package -DskipTests
if %errorlevel% neq 0 (
    echo Backend build failed!
    exit /b %errorlevel%
)

echo.
echo [2/3] Building Frontend...
cd ..\warehouse-frontend
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b %errorlevel%
)

echo.
echo [3/3] Building Docker Images...
cd ..
docker-compose build
if %errorlevel% neq 0 (
    echo Docker build failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================