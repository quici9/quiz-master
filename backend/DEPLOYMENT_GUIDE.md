# QuizMaster Backend - Deployment Guide

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 16+
- npm or yarn

## 🚀 Quick Start (Development)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create `.env` file in backend directory:

```env
DATABASE_URL="postgresql://quizuser:quizpass@localhost:5432/quizdb"
JWT_SECRET="change-this-to-a-very-long-random-secret-key-minimum-32-characters"
JWT_REFRESH_SECRET="change-this-to-another-very-long-random-secret-minimum-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 3. Setup Database

#### Option A: Using Docker (Recommended)

```bash
# From project root
docker-compose up -d db
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb quizdb

# Or using psql
psql -U postgres
CREATE DATABASE quizdb;
CREATE USER quizuser WITH PASSWORD 'quizpass';
GRANT ALL PRIVILEGES ON DATABASE quizdb TO quizuser;
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run start:dev
```

Server will start at: http://localhost:4000

API endpoints: http://localhost:4000/api

Health check: http://localhost:4000/api/health

## 🧪 Test the API

### 1. Register a New User

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "fullName": "Test User"
  }'
```

### 2. Login (Admin)

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Save the `accessToken` from response.

### 3. Get Categories (Public)

```bash
curl http://localhost:4000/api/categories
```

### 4. Get Quizzes (Public)

```bash
curl http://localhost:4000/api/quizzes
```

### 5. Get User Profile (Protected)

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# From project root
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Services:
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432
- Adminer (DB UI): http://localhost:8080

## 📊 Database Management

### Prisma Studio (GUI)

```bash
npx prisma studio
```

Opens at: http://localhost:5555

### View Database

Using Adminer (when running docker-compose):
- URL: http://localhost:8080
- System: PostgreSQL
- Server: db
- Username: quizuser
- Password: quizpass
- Database: quizdb

### Reset Database

```bash
# ⚠️ This will delete all data
npx prisma migrate reset

# Then seed again
npx prisma db seed
```

## 📁 Upload Quiz File

### Using Postman/Thunder Client

1. **Endpoint**: POST http://localhost:4000/api/quizzes/import
2. **Authorization**: Bearer Token (admin token)
3. **Body**: form-data
   - `file`: Select .docx file
   - `title`: Quiz Title
   - `description`: Quiz Description (optional)
   - `categoryId`: Category UUID (optional)

### Using cURL

```bash
curl -X POST http://localhost:4000/api/quizzes/import \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@path/to/quiz.docx" \
  -F "title=My Quiz Title" \
  -F "description=Quiz description"
```

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps

# Or for local PostgreSQL
sudo systemctl status postgresql
```

### Prisma Client Not Found

```bash
npx prisma generate
```

### Migration Errors

```bash
# Reset and reapply all migrations
npx prisma migrate reset
npx prisma migrate dev
```

### Port Already in Use

```bash
# Change PORT in .env file
PORT=4001
```

## 🔐 Default Credentials

### Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: ADMIN

### Test User
- **Email**: user@example.com
- **Password**: user123
- **Role**: USER

⚠️ **Important**: Change these credentials in production!

## 📝 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload

# Production
npm run build              # Build TypeScript
npm run start:prod         # Start production server

# Database
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Run migrations (dev)
npx prisma migrate deploy  # Run migrations (prod)
npx prisma db seed         # Seed database
npx prisma studio          # Open Prisma Studio

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Test coverage

# Linting
npm run lint               # Lint code
npm run format             # Format code
```

## 🌐 Production Deployment

### 1. Set Production Environment Variables

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:pass@production-host:5432/dbname"
JWT_SECRET="very-long-random-secret-key-for-production"
JWT_REFRESH_SECRET="another-very-long-random-secret-key"
CORS_ORIGIN="https://your-frontend-domain.com"
```

### 2. Build Application

```bash
npm run build
```

### 3. Run Migrations

```bash
npx prisma migrate deploy
```

### 4. Start Production Server

```bash
npm run start:prod
```

### 5. Use Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name quizmaster-api

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

## 📈 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:4000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Check Logs

```bash
# Docker logs
docker-compose logs -f backend

# PM2 logs
pm2 logs quizmaster-api

# Application logs (in LoggingInterceptor)
# Check console output
```

## 🔒 Security Checklist

- [ ] Change default admin/user passwords
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Configure CORS for specific domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs for suspicious activity

## 💡 Tips

1. **File Size Limit**: Default max upload is 10MB (configurable in .env)
2. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days
3. **Quiz Format**: See `WORD_FORMAT_EXAMPLE.md` for Word file format
4. **Leaderboard**: Updates automatically when users submit quiz attempts
5. **XP System**: Users gain 1 XP per 10 points scored
6. **Level System**: Users level up every 100 XP

## 📞 Support

For issues or questions:
1. Check `IMPLEMENTATION_STATUS.md` for feature status
2. Review API endpoints in the plan document
3. Check Prisma schema for data structure

