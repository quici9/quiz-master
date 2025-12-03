# Environment Variables Template

Copy this to `.env` file:

```env
# Database
DATABASE_URL="postgresql://quizuser:quizpass@localhost:5432/quizdb"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
```

