# Docker Setup Guide for QuizMaster

This guide explains how to run QuizMaster using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 2GB free RAM
- At least 5GB free disk space

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` and update the following critical values:
- `JWT_SECRET` - Change to a strong random string
- `JWT_REFRESH_SECRET` - Change to a different strong random string
- `POSTGRES_PASSWORD` - Change to a secure password

### 2. Production Deployment

Start all services in production mode:

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database on port 5432
- Start NestJS backend on port 4000
- Start React frontend on port 3000
- Run database migrations and seed data automatically

### 3. Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

This enables:
- Hot reload for backend code changes
- Vite HMR for frontend changes
- Source code mounted as volumes
- Development-friendly JWT expiration times

## Accessing the Application

Once running, access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Database**: localhost:5432

Default admin credentials (created by seed):
- Email: admin@quiz.com
- Password: Admin123!

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services

```bash
# Stop but keep data
docker-compose stop

# Stop and remove containers (keeps volumes)
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images

```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build
```

### Execute Commands in Containers

```bash
# Backend bash
docker-compose exec backend sh

# Run Prisma migrations
docker-compose exec backend npx prisma migrate dev

# Frontend bash
docker-compose exec frontend sh

# Database psql
docker-compose exec db psql -U quizuser -d quizdb
```

## Environment Variables

### Database Variables
- `POSTGRES_USER` - PostgreSQL username (default: quizuser)
- `POSTGRES_PASSWORD` - PostgreSQL password (default: quizpass)
- `POSTGRES_DB` - Database name (default: quizdb)
- `POSTGRES_PORT` - External port for PostgreSQL (default: 5432)

### Backend Variables
- `BACKEND_PORT` - Backend API port (default: 4000)
- `NODE_ENV` - Environment mode (production/development)
- `JWT_SECRET` - JWT signing secret (CHANGE IN PRODUCTION!)
- `JWT_REFRESH_SECRET` - Refresh token secret (CHANGE IN PRODUCTION!)
- `JWT_EXPIRATION` - Access token lifetime (default: 1h)
- `JWT_REFRESH_EXPIRATION` - Refresh token lifetime (default: 7d)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)
- `MAX_FILE_SIZE` - Max upload size in bytes (default: 10MB)

### Frontend Variables
- `FRONTEND_PORT` - Frontend port (default: 3000)
- `VITE_API_URL` - Backend API URL (default: http://localhost:4000/api)

## Port Configuration

If you need to change ports (e.g., port conflicts), edit your `.env`:

```env
POSTGRES_PORT=5433
BACKEND_PORT=4001
FRONTEND_PORT=3001
```

Then update `VITE_API_URL` accordingly:

```env
VITE_API_URL=http://localhost:4001/api
```

## Health Checks

All services include health checks:
- **Database**: Checks PostgreSQL readiness
- **Backend**: HTTP check on /api endpoint
- **Frontend**: HTTP check on root endpoint

View health status:

```bash
docker-compose ps
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

1. Check what's using the port:
   ```bash
   lsof -i :4000  # or :3000, :5432
   ```

2. Either stop that process or change the port in `.env`

### Database Connection Failed

If backend can't connect to database:

1. Check database is healthy:
   ```bash
   docker-compose ps db
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Verify DATABASE_URL matches your PostgreSQL settings

### Frontend Can't Reach Backend

If frontend gets CORS or connection errors:

1. Verify `CORS_ORIGIN` in backend matches your frontend URL
2. Verify `VITE_API_URL` in frontend is correct
3. Check backend is running:
   ```bash
   curl http://localhost:4000/api
   ```

### Reset Everything

To start fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all -v

# Start fresh
docker-compose up -d --build
```

### View Container Resource Usage

```bash
docker stats
```

## Production Considerations

### Security

1. **Change default secrets** in `.env`:
   ```env
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_REFRESH_SECRET=$(openssl rand -base64 32)
   POSTGRES_PASSWORD=$(openssl rand -base64 16)
   ```

2. **Update CORS_ORIGIN** to your production domain:
   ```env
   CORS_ORIGIN=https://yourdomain.com
   ```

3. **Don't expose database port** in production:
   - Comment out or remove `ports:` section from `db` service

### Performance

1. **Set resource limits** in docker-compose.yml:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
   ```

2. **Use Docker volumes** instead of bind mounts for better performance

3. **Enable logging rotation** (already configured)

### Backup

Backup PostgreSQL data:

```bash
# Backup
docker-compose exec -T db pg_dump -U quizuser quizdb > backup.sql

# Restore
docker-compose exec -T db psql -U quizuser quizdb < backup.sql
```

## Docker Compose Profiles

The project includes two compose files:

1. **docker-compose.yml** - Production optimized
   - Builds optimized production images
   - No source code mounting
   - Minimal logging
   - Strict health checks

2. **docker-compose.dev.yml** - Development friendly
   - Hot reload enabled
   - Source code mounted as volumes
   - Verbose logging
   - Relaxed JWT expiration

## Network Architecture

All services communicate over a private Docker network (`quiz-network`):

```
┌─────────────────────────────────────┐
│         Docker Network              │
│                                     │
│  ┌──────────┐    ┌──────────┐     │
│  │ Frontend │───▶│ Backend  │     │
│  │  :3000   │    │  :4000   │     │
│  └──────────┘    └─────┬────┘     │
│                        │           │
│                   ┌────▼─────┐    │
│                   │   DB     │    │
│                   │  :5432   │    │
│                   └──────────┘    │
└─────────────────────────────────────┘
         │           │          │
    Port 3000   Port 4000  Port 5432
    (external)  (external) (optional)
```

## CI/CD Integration

### Build Images

```bash
# Build with specific tag
docker-compose build --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

# Tag for registry
docker tag quiz-backend:latest registry.example.com/quiz-backend:v1.0.0
docker tag quiz-frontend:latest registry.example.com/quiz-frontend:v1.0.0
```

### Push to Registry

```bash
docker-compose push
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Check health: `docker-compose ps`
3. Verify environment variables in `.env`
4. Review this guide's troubleshooting section

