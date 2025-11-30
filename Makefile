.PHONY: help build start stop restart logs clean

help:
	@echo "Warehouse Management System - Make Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build    - Build all Docker images"
	@echo "  make start    - Start all services"
	@echo "  make stop     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs"
	@echo "  make clean    - Remove all containers and volumes"

build:
	@echo "Building all services..."
	docker-compose build

start:
	@echo "Starting all services..."
	docker-compose up -d
	@echo ""
	@echo "Services started successfully!"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost:8080/api"

stop:
	@echo "Stopping all services..."
	docker-compose down

restart: stop start

logs:
	docker-compose logs -f

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	docker system prune -f
	@echo "Cleanup completed!"

status:
	docker-compose ps

frontend-logs:
	docker-compose logs -f frontend

backend-logs:
	docker-compose logs -f backend

db-logs:
	docker-compose logs -f postgres