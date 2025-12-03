.PHONY: help build up down restart logs clean dev dev-down prod-build prod-up prod-down db-backup db-restore

# Colors for output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

help: ## Show this help message
	@echo '${GREEN}QuizMaster Docker Commands${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "  ${YELLOW}%-20s${RESET}%s\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${GREEN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)

## Development Commands

dev: ## Start development environment with hot-reload
	@echo "${GREEN}Starting development environment...${RESET}"
	docker-compose -f docker-compose.dev.yml up

dev-build: ## Build development images
	@echo "${GREEN}Building development images...${RESET}"
	docker-compose -f docker-compose.dev.yml build

dev-down: ## Stop development environment
	@echo "${YELLOW}Stopping development environment...${RESET}"
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

## Production Commands

prod-build: ## Build production images
	@echo "${GREEN}Building production images...${RESET}"
	docker-compose build

prod-up: ## Start production environment
	@echo "${GREEN}Starting production environment...${RESET}"
	docker-compose up -d

prod-down: ## Stop production environment
	@echo "${YELLOW}Stopping production environment...${RESET}"
	docker-compose down

prod-restart: ## Restart production environment
	@echo "${YELLOW}Restarting production environment...${RESET}"
	docker-compose restart

## General Commands

build: ## Build all images (production)
	@echo "${GREEN}Building all images...${RESET}"
	docker-compose build

up: ## Start all services in detached mode (production)
	@echo "${GREEN}Starting all services...${RESET}"
	docker-compose up -d

down: ## Stop all services and remove containers
	@echo "${YELLOW}Stopping all services...${RESET}"
	docker-compose down

restart: ## Restart all services
	@echo "${YELLOW}Restarting all services...${RESET}"
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs only
	docker-compose logs -f backend

logs-frontend: ## View frontend logs only
	docker-compose logs -f frontend

logs-db: ## View database logs only
	docker-compose logs -f db

ps: ## Show running containers
	docker-compose ps

## Database Commands

db-shell: ## Connect to PostgreSQL shell
	docker-compose exec db psql -U quizuser -d quizdb

db-backup: ## Backup database to backup.sql
	@echo "${GREEN}Backing up database...${RESET}"
	docker-compose exec -T db pg_dump -U quizuser quizdb > backup.sql
	@echo "${GREEN}Backup saved to backup.sql${RESET}"

db-restore: ## Restore database from backup.sql
	@echo "${YELLOW}Restoring database from backup.sql...${RESET}"
	docker-compose exec -T db psql -U quizuser quizdb < backup.sql
	@echo "${GREEN}Database restored${RESET}"

db-reset: ## Reset database (dangerous!)
	@echo "${YELLOW}Resetting database...${RESET}"
	docker-compose down -v
	docker-compose up -d db
	@echo "${GREEN}Database reset complete${RESET}"

## Backend Commands

backend-shell: ## Open shell in backend container
	docker-compose exec backend sh

backend-restart: ## Restart backend service
	docker-compose restart backend

backend-logs: ## View backend logs
	docker-compose logs -f backend

prisma-migrate: ## Run Prisma migrations
	docker-compose exec backend npx prisma migrate dev

prisma-studio: ## Open Prisma Studio
	docker-compose exec backend npx prisma studio

prisma-generate: ## Generate Prisma client
	docker-compose exec backend npx prisma generate

prisma-seed: ## Seed database
	docker-compose exec backend npx prisma db seed

## Frontend Commands

frontend-shell: ## Open shell in frontend container
	docker-compose exec frontend sh

frontend-restart: ## Restart frontend service
	docker-compose restart frontend

frontend-logs: ## View frontend logs
	docker-compose logs -f frontend

## Cleanup Commands

clean: ## Stop services and remove containers, networks, and volumes
	@echo "${YELLOW}Cleaning up everything...${RESET}"
	docker-compose down -v
	@echo "${GREEN}Cleanup complete${RESET}"

clean-all: ## Remove everything including images
	@echo "${YELLOW}Removing all containers, networks, volumes, and images...${RESET}"
	docker-compose down -v --rmi all
	@echo "${GREEN}Complete cleanup done${RESET}"

prune: ## Remove unused Docker resources
	@echo "${YELLOW}Pruning unused Docker resources...${RESET}"
	docker system prune -af --volumes
	@echo "${GREEN}Pruning complete${RESET}"

## Utility Commands

status: ## Show status of all containers
	@docker-compose ps
	@echo ""
	@echo "${GREEN}Health Status:${RESET}"
	@docker ps --filter "name=quiz" --format "table {{.Names}}\t{{.Status}}"

check-env: ## Check if .env file exists
	@if [ -f .env ]; then \
		echo "${GREEN}.env file exists${RESET}"; \
	else \
		echo "${YELLOW}.env file not found. Copy env.example to .env${RESET}"; \
		echo "Run: cp env.example .env"; \
	fi

setup: check-env ## Initial setup - create .env if needed
	@if [ ! -f .env ]; then \
		echo "${YELLOW}Creating .env from env.example...${RESET}"; \
		cp env.example .env; \
		echo "${GREEN}.env created. Please update JWT secrets and passwords!${RESET}"; \
	fi

install: setup build up ## Complete installation - setup, build, and start
	@echo "${GREEN}Installation complete!${RESET}"
	@echo "${GREEN}Frontend: http://localhost:3000${RESET}"
	@echo "${GREEN}Backend:  http://localhost:4000/api${RESET}"

rebuild: ## Rebuild and restart all services
	@echo "${GREEN}Rebuilding all services...${RESET}"
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "${GREEN}Rebuild complete${RESET}"

