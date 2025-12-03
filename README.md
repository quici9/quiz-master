# QuizMaster - Quiz Practice System

A modern, full-stack quiz practice system built with React, NestJS, PostgreSQL, and Docker.

![Tech Stack](https://img.shields.io/badge/React-19.2.0-blue)
![Tech Stack](https://img.shields.io/badge/NestJS-11.0-red)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-blue)
![Tech Stack](https://img.shields.io/badge/Docker-Ready-blue)

## 🌟 Features

### User Features
- 🔐 **Authentication**: Secure JWT-based registration and login
- 📝 **Quiz Taking**: Interactive quiz interface with timer and progress tracking
- 📊 **Results & Analytics**: Detailed performance review with statistics
- 🔖 **Bookmarks**: Save difficult questions for later review
- 📈 **History**: Track and analyze past quiz attempts
- 🏆 **Leaderboard**: Compete with other users on weekly/monthly rankings
- 🎨 **Modern UI**: Beautiful glassmorphism design with responsive layout

### Admin Features
- 📤 **Quiz Upload**: Import quizzes from .docx files (Word format)
- ✏️ **Quiz Management**: Create, edit, and delete quizzes
- 📚 **Category Management**: Organize quizzes by categories
- 👥 **User Management**: View and manage user accounts
- 📊 **Analytics Dashboard**: View system-wide statistics

### Technical Features
- 🐳 **Docker Ready**: One-command deployment with Docker Compose
- 🔄 **Hot Reload**: Development mode with instant code changes
- 🔒 **Security**: Helmet, CORS, password hashing, JWT refresh tokens
- 🚀 **Performance**: Optimized builds, compression, caching
- 📱 **Responsive**: Mobile-friendly interface
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- ⚡ **Fast**: Vite for frontend, NestJS for backend

## 🚀 Quick Start (Recommended)

### Using the Quick Start Script

```bash
# Clone the repository
git clone <your-repo-url>
cd QuizMaster

# Run the quick start script
./docker-start.sh
```

The script will:
1. Check Docker installation
2. Create `.env` file from template
3. Ask for production or development mode
4. Build and start all services
5. Show access URLs and credentials

### Using Make (Alternative)

```bash
# Install and start everything
make install

# Or start development mode
make dev
```

### Manual Docker Compose (Alternative)

```bash
# 1. Create environment file
cp env.example .env

# 2. Edit .env and update JWT secrets and passwords
nano .env

# 3. Start in production mode
docker-compose up -d --build

# OR start in development mode (with hot-reload)
docker-compose -f docker-compose.dev.yml up
```

## 🌐 Access the Application

Once started, access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Database**: localhost:5432 (in dev mode)

### Default Admin Credentials

```
Email:    admin@example.com
Password: admin123
```

**Test User Credentials:**
```
Email:    user@example.com
Password: user123
```

*Note: Change these credentials after first login!*

## 📋 Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **RAM**: At least 2GB free
- **Disk**: At least 5GB free space

### Optional (for local development without Docker)
- **Node.js**: Version 20.x or higher
- **PostgreSQL**: Version 16 or higher
- **npm**: Version 10.x or higher

## 📖 Documentation

- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Comprehensive Docker setup and troubleshooting
- **[USER_GUIDE.md](USER_GUIDE.md)** - How to use the application
- **[SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)** - Architecture and design decisions
- **[backend/DEPLOYMENT_GUIDE.md](backend/DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[WORD_FORMAT_EXAMPLE.md](WORD_FORMAT_EXAMPLE.md)** - Quiz document format guide

## 🛠️ Development

### Local Development (Without Docker)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup database (make sure PostgreSQL is running)
createdb quizdb

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on: http://localhost:4000

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_URL=http://localhost:4000/api" > .env

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

### Docker Development Mode

For development with hot-reload:

```bash
# Start all services in dev mode
make dev

# Or using docker-compose directly
docker-compose -f docker-compose.dev.yml up
```

This enables:
- ♻️ Hot reload for backend (NestJS watch mode)
- ⚡ Vite HMR for frontend
- 📝 Source code mounted as volumes
- 🔍 Verbose logging

## 🐳 Docker Commands

Common commands using Make:

```bash
make help          # Show all available commands
make dev           # Start development environment
make prod-up       # Start production environment
make logs          # View all logs
make down          # Stop all services
make clean         # Remove all containers and volumes
make db-backup     # Backup database
make db-shell      # Open PostgreSQL shell
```

Or using docker-compose directly:

```bash
# Production
docker-compose up -d              # Start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose restart backend    # Restart service

# Development
docker-compose -f docker-compose.dev.yml up    # Start dev
docker-compose -f docker-compose.dev.yml down  # Stop dev
```

See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for more commands and troubleshooting.

## 🏗️ Project Structure

```
QuizMaster/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── quizzes/        # Quiz management
│   │   ├── questions/      # Question management
│   │   ├── attempts/       # Quiz attempts
│   │   ├── categories/     # Category management
│   │   ├── bookmarks/      # User bookmarks
│   │   ├── leaderboard/    # Leaderboard system
│   │   ├── analytics/      # Analytics service
│   │   └── prisma/         # Database service
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   └── Dockerfile          # Production build
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── Dockerfile          # Production build
│
├── docker-compose.yml      # Production config
├── docker-compose.dev.yml  # Development config
├── Makefile               # Command shortcuts
└── docker-start.sh        # Quick start script
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests (when configured)
npm test
```

## 🔧 Environment Variables

Key environment variables (see `env.example` for complete list):

### Database
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password (⚠️ Change in production!)
- `POSTGRES_DB` - Database name

### Backend
- `JWT_SECRET` - JWT signing secret (⚠️ Change in production!)
- `JWT_REFRESH_SECRET` - Refresh token secret (⚠️ Change in production!)
- `CORS_ORIGIN` - Allowed frontend origin
- `PORT` - Backend port (default: 4000)

### Frontend
- `VITE_API_URL` - Backend API URL

## 🔒 Security Notes

⚠️ **IMPORTANT**: Before deploying to production:

1. ✅ Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values
2. ✅ Change `POSTGRES_PASSWORD` to a secure password
3. ✅ Update `CORS_ORIGIN` to your production domain
4. ✅ Change default admin password after first login
5. ✅ Don't expose database port (5432) in production
6. ✅ Use HTTPS in production
7. ✅ Set up proper firewall rules

Generate secure secrets:
```bash
# For JWT secrets
openssl rand -base64 32

# For passwords
openssl rand -base64 16
```

## 📝 API Documentation

Once running, API documentation is available at:
- Swagger UI: http://localhost:4000/api/docs (if enabled)
- API Base: http://localhost:4000/api

Key endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/quizzes` - List quizzes
- `POST /api/attempts` - Start quiz attempt
- `GET /api/leaderboard` - Get leaderboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Tech Stack

### Frontend
- **React 19.2** - UI library
- **React Router 7** - Routing
- **Axios** - HTTP client
- **Tailwind CSS 3** - Styling
- **Vite 7** - Build tool

### Backend
- **NestJS 11** - Backend framework
- **Prisma 5** - ORM
- **PostgreSQL 16** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Compression** - Response compression

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server

## 🐛 Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :4000

# Change port in .env
BACKEND_PORT=4001
```

### Database connection failed
```bash
# Check database logs
docker-compose logs db

# Reset database
make db-reset
```

### Frontend can't reach backend
- Check `CORS_ORIGIN` matches frontend URL
- Verify `VITE_API_URL` is correct
- Check backend is running: `curl http://localhost:4000/api`

For more troubleshooting, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md).

## 📞 Support

For issues and questions:
1. Check the documentation in `/docs` folder
2. Review [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for Docker issues
3. Check existing GitHub issues
4. Create a new issue with detailed description

## ⭐ Acknowledgments

Built with modern technologies and best practices for educational purposes.
