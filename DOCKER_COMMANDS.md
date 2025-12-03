# Docker Commands Quick Reference

## 🚀 Getting Started

```bash
# Easiest way - Interactive script
./docker-start.sh

# Or using Make
make install          # Setup + Build + Start

# Or manually
cp env.example .env   # Create environment file
# Edit .env file
docker-compose up -d --build
```

## 📋 Daily Commands

### Start/Stop

```bash
# Production
make prod-up          # Start production
make prod-down        # Stop production
make prod-restart     # Restart production

# Development
make dev              # Start development (hot-reload)
make dev-down         # Stop development
```

### View Logs

```bash
make logs             # All services
make logs-backend     # Backend only
make logs-frontend    # Frontend only
make logs-db          # Database only
```

### Service Status

```bash
make ps               # List containers
make status           # Detailed status with health
docker-compose ps     # Docker compose status
```

## 🔧 Development Commands

```bash
make dev              # Start dev mode with hot-reload
make dev-build        # Rebuild dev images
make dev-down         # Stop dev mode
make dev-logs         # View dev logs

# Backend shell
make backend-shell    # Open shell in backend
docker-compose exec backend sh

# Frontend shell
make frontend-shell   # Open shell in frontend
docker-compose exec frontend sh
```

## 🗄️ Database Commands

```bash
# Database shell
make db-shell         # Open PostgreSQL shell
docker-compose exec db psql -U quizuser -d quizdb

# Backup & Restore
make db-backup        # Backup to backup.sql
make db-restore       # Restore from backup.sql

# Prisma commands (backend)
make prisma-migrate   # Run migrations
make prisma-studio    # Open Prisma Studio
make prisma-generate  # Generate Prisma client
make prisma-seed      # Seed database

# Reset database (⚠️ Destructive!)
make db-reset         # Delete all data and restart
```

## 🏗️ Build Commands

```bash
# Production
make build            # Build all images
make prod-build       # Build production images
make rebuild          # Clean rebuild (no cache)

# Development
make dev-build        # Build development images

# Specific service
docker-compose build backend
docker-compose build frontend
```

## 🧹 Cleanup Commands

```bash
make clean            # Remove containers + volumes
make clean-all        # Remove containers + volumes + images
make prune            # Prune unused Docker resources

# Manually
docker-compose down              # Stop and remove containers
docker-compose down -v           # Stop + remove volumes
docker-compose down --rmi all    # Stop + remove images
```

## 📊 Monitoring Commands

```bash
# View logs
docker-compose logs -f                    # All logs
docker-compose logs -f backend            # Backend logs
docker-compose logs --tail=100 backend    # Last 100 lines

# Resource usage
docker stats                              # Live resource stats

# Container details
docker-compose ps                         # Container status
docker inspect quiz-backend               # Detailed info
```

## 🔄 Update & Restart

```bash
# After code changes (production)
docker-compose down
docker-compose up -d --build

# Or using Make
make rebuild

# Restart specific service
make backend-restart
make frontend-restart
docker-compose restart backend
```

## 🐛 Debugging Commands

```bash
# Check health
docker-compose ps
docker inspect quiz-backend | grep Health

# View full logs
docker-compose logs backend
docker-compose logs --tail=500 backend

# Execute command in container
docker-compose exec backend ls -la
docker-compose exec backend npm list
docker-compose exec backend cat .env

# View environment variables
docker-compose exec backend env

# Network debugging
docker-compose exec backend ping db
docker-compose exec frontend ping backend
docker network ls
docker network inspect quiz-network
```

## 🔒 Security Commands

```bash
# Generate secure secrets
openssl rand -base64 32    # For JWT secrets
openssl rand -base64 16    # For passwords

# Check .env file
cat .env

# View container logs for security events
docker-compose logs backend | grep -i error
docker-compose logs backend | grep -i unauthorized
```

## 📦 Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect quiz-postgres-data

# Backup volume
docker run --rm -v quiz-postgres-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore volume
docker run --rm -v quiz-postgres-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz -C /
```

## 🌐 Network Commands

```bash
# List networks
docker network ls

# Inspect network
docker network inspect quiz-network

# View connected containers
docker network inspect quiz-network | grep Name
```

## 📈 Performance Commands

```bash
# View resource usage
docker stats

# View image sizes
docker images

# Analyze build cache
docker buildx du

# Prune to free space
docker system prune -af --volumes
```

## 🧪 Testing Commands

```bash
# Test backend API
curl http://localhost:4000/api

# Test frontend
curl http://localhost:3000

# Test database connection
docker-compose exec db pg_isready -U quizuser

# Run backend tests
docker-compose exec backend npm test

# Run e2e tests
docker-compose exec backend npm run test:e2e
```

## 🔄 Docker Compose Alternatives

If `make` is not available, use `docker-compose` directly:

```bash
# Production
docker-compose up -d
docker-compose down
docker-compose restart
docker-compose logs -f
docker-compose ps
docker-compose build

# Development
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f
```

## 📱 Quick Access URLs

Once running:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000/api
- **Database**: localhost:5432 (only in dev)

## 🆘 Emergency Commands

```bash
# Stop everything immediately
docker-compose kill

# Remove everything and start fresh
docker-compose down -v --rmi all
make install

# Force rebuild specific service
docker-compose build --no-cache backend
docker-compose up -d --force-recreate backend

# Export logs for debugging
docker-compose logs > debug-logs.txt

# Check Docker daemon
docker info
docker version
```

## 💡 Pro Tips

```bash
# Run command without entering container
docker-compose exec backend npx prisma studio

# Copy files from/to container
docker cp quiz-backend:/app/uploads ./uploads-backup
docker cp ./myfile.txt quiz-backend:/app/

# Follow logs from multiple services
docker-compose logs -f backend frontend

# Start only specific services
docker-compose up -d db backend

# Scale services (if configured)
docker-compose up -d --scale backend=3

# Update images
docker-compose pull
docker-compose up -d

# Validate compose file
docker-compose config
```

## 🎯 Most Common Workflows

### First Time Setup
```bash
./docker-start.sh
# or
make install
```

### Daily Development
```bash
make dev              # Start
# Edit code (auto-reloads)
make dev-down         # Stop when done
```

### View Logs When Debugging
```bash
make logs-backend
```

### Reset Database
```bash
make db-backup        # Backup first!
make db-reset         # Reset
```

### Deploy New Code to Production
```bash
git pull
make prod-down
make prod-build
make prod-up
```

### Backup Before Major Changes
```bash
make db-backup
cp .env .env.backup
```

## 📚 Related Documentation

- **DOCKER_GUIDE.md** - Complete Docker guide
- **DOCKER_SETUP_SUMMARY.md** - What's been configured
- **README.md** - General project documentation
- **Makefile** - See all Make targets: `make help`

---

**Need help?** Run `make help` to see all available commands!

