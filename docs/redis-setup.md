# Redis Setup Guide

## Overview
Redis is used in QuizMaster for:
- Caching API responses (Quizzes, Leaderboards)
- Rate limiting storage
- Background job queues (BullMQ)
- Session storage (Auto-save)

## Configuration
Redis is configured via `docker-compose.yml`.

### Environment Variables
- `REDIS_HOST`: Hostname of the Redis service (default: `redis`)
- `REDIS_PORT`: Port number (default: `6379`)

### Connection Details
- **Port**: 6379
- **Persistence**: Enabled (AOF/RDB)
- **Volume**: `redis-data`

## Caching Strategy
- **TTL**:
  - Quiz List: 1 hour
  - Quiz Details: 1 hour
  - Leaderboard: 5 minutes
- **Invalidation**:
  - Cache is invalidated on mutation (Create/Update/Delete)
  - Pattern-based invalidation is used for lists (e.g., `quizzes:list:*`)

## Troubleshooting
- **Check Connection**: `docker-compose exec backend redis-cli -h redis ping`
- **Monitor**: `docker-compose exec redis redis-cli monitor`
- **Flush Cache**: `docker-compose exec redis redis-cli FLUSHALL`
