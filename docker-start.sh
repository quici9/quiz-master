#!/bin/bash

# QuizMaster Docker Quick Start Script
# This script helps you quickly start the QuizMaster application using Docker

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║   QuizMaster Docker Quick Start      ║"
echo "╔═══════════════════════════════════════╗"
echo -e "${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

# Use docker-compose or docker compose based on availability
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from env.example...${NC}"
    cp env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Please update the following in .env:${NC}"
    echo "   - JWT_SECRET"
    echo "   - JWT_REFRESH_SECRET"
    echo "   - POSTGRES_PASSWORD"
    echo ""
    read -p "Press Enter to continue after updating .env, or Ctrl+C to exit..."
fi

# Ask user which mode to run
echo ""
echo "Select mode:"
echo "1) Production (optimized, no hot-reload)"
echo "2) Development (hot-reload enabled)"
echo ""
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo -e "${GREEN}Starting in PRODUCTION mode...${NC}"
        COMPOSE_FILE="docker-compose.yml"
        MODE="production"
        ;;
    2)
        echo -e "${GREEN}Starting in DEVELOPMENT mode...${NC}"
        COMPOSE_FILE="docker-compose.dev.yml"
        MODE="development"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Building Docker images... (this may take a few minutes)${NC}"
$DOCKER_COMPOSE -f $COMPOSE_FILE build

echo ""
echo -e "${YELLOW}Starting services...${NC}"
$DOCKER_COMPOSE -f $COMPOSE_FILE up -d

echo ""
echo -e "${GREEN}Waiting for services to be ready...${NC}"
sleep 5

# Check if services are running
echo ""
echo -e "${GREEN}Service Status:${NC}"
$DOCKER_COMPOSE -f $COMPOSE_FILE ps

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   QuizMaster is now running!         ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Access the application:${NC}"
echo "  • Frontend:  http://localhost:${FRONTEND_PORT:-3000}"
echo "  • Backend:   http://localhost:${BACKEND_PORT:-4000}/api"
if [ "$MODE" = "development" ]; then
    echo "  • Database:  localhost:${POSTGRES_PORT:-5432}"
fi
echo ""
echo -e "${GREEN}Default Admin Login:${NC}"
echo "  • Email:     admin@quiz.com"
echo "  • Password:  Admin123!"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  • View logs:     $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f"
echo "  • Stop services: $DOCKER_COMPOSE -f $COMPOSE_FILE down"
echo "  • Restart:       $DOCKER_COMPOSE -f $COMPOSE_FILE restart"
echo ""
echo -e "${YELLOW}For more commands, see DOCKER_GUIDE.md${NC}"
echo ""

# Ask if user wants to view logs
read -p "View logs now? [y/N]: " view_logs
if [[ $view_logs =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Showing logs (press Ctrl+C to exit)...${NC}"
    $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f
fi

