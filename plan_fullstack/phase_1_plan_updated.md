# Phase 1: Performance & Stability Foundation

## 📋 Summary

**Duration:** 3-4 weeks  
**Team Size:** 2-3 Backend Engineers + 1 DevOps  
**Priority:** 🔴 CRITICAL  
**Status:** Ready for implementation

Transform QuizMaster from a functional MVP into a production-grade, high-performance application capable of supporting 50+ concurrent users with enterprise-level reliability.

---

## 🎯 Objective

**Primary Goal:**  
Establish a robust infrastructure foundation that ensures system stability, performance, and observability before adding new features.

**Success Metrics:**
- API response time p95: 200ms → <100ms (2x improvement)
- Support 50+ concurrent users (from 20)
- Cache hit rate: >80%
- Zero downtime deployments
- 99.9% uptime
- All errors logged with full context
- Background jobs process without blocking API

**Why Phase 1 First:**
- ⚠️ Current system will collapse under load without infrastructure upgrades
- 🎯 All future phases depend on this foundation
- 🔒 Critical for production readiness
- 📊 Enables proper monitoring and debugging

---

## 📦 Scope

### ✅ In Scope

**Infrastructure:**
1. Redis caching layer (sessions, queries, leaderboard)
2. BullMQ message queue (background jobs)
3. Rate limiting (DDoS protection)
4. Structured logging (Winston)
5. APM integration (New Relic)
6. Auto-save progress (prevent data loss)

**DevOps:**
1. Docker Compose updates (Redis, monitoring)
2. Nginx caching configuration
3. Health check endpoints
4. Deployment automation basics

### ❌ Out of Scope

- New user-facing features (Phase 2)
- Admin dashboard improvements (Phase 3)
- Microservices architecture (future)
- Kubernetes deployment (future)
- Advanced CI/CD pipeline (future)

---

## 👥 User Stories

### US-01: Fast API Response
```
As a user taking a quiz,
I want pages to load in <1 second,
So that I can focus on learning without waiting.

Current: 2-3 seconds
Target: <1 second
Solution: Redis caching
```

### US-02: No Lost Progress
```
As a user taking a quiz,
I want my progress automatically saved,
So that I don't lose answers if browser crashes.

Current: Lost on crash
Target: Auto-save every 30s
Solution: Auto-save to backend + localStorage
```

### US-03: File Upload Without Waiting
```
As an admin uploading a Word file,
I want to continue working while file processes,
So that I'm not blocked waiting 30 seconds.

Current: 30s blocked request
Target: Immediate response, background processing
Solution: BullMQ job queue
```

### US-04: Protected from Abuse
```
As a system administrator,
I want rate limiting on all endpoints,
So that malicious users can't DDoS the system.

Current: No protection
Target: 100 req/min global, 5 login attempts/15min
Solution: Redis-backed rate limiting
```

### US-05: Production Debugging
```
As a developer fixing production bugs,
I want structured, searchable logs,
So that I can find issues in <1 minute.

Current: console.log scattered everywhere
Target: JSON logs with context, searchable
Solution: Winston with correlation IDs
```

### US-06: System Health Visibility
```
As a DevOps engineer,
I want real-time system metrics,
So that I can detect issues before users complain.

Current: No visibility
Target: Dashboard with response times, errors, resources
Solution: New Relic APM
```

---

## 🎨 Feature Breakdown

### Feature 1.1: Redis Caching Layer

**Objective:** Reduce database load by 80%, improve response time 4x

**Cache Strategies:**

| Cache Type | Key Pattern | TTL | Invalidation |
|------------|-------------|-----|--------------|
| User sessions | `session:{userId}` | 24h | On logout |
| Quiz list | `quiz:list:{categoryId}` | 1h | On quiz create/update |
| Quiz details | `quiz:{quizId}` | 2h | On quiz update |
| Questions | `quiz:{quizId}:questions` | 2h | On quiz update |
| Leaderboard | `leaderboard:{quizId}` | 5m | On attempt complete |
| User stats | `user:{userId}:stats` | 15m | On attempt complete |

**Cache Invalidation Rules:**
```typescript
// When quiz updated
await redis.del(`quiz:${quizId}`);
await redis.del(`quiz:${quizId}:questions`);
await redis.del(`quiz:list:${categoryId}`);

// When attempt completed
await redis.del(`leaderboard:${quizId}`);
await redis.del(`user:${userId}:stats`);
```

**Technical Implementation:**
- Library: `ioredis` + `cache-manager`
- Pattern: Cache-aside (lazy loading)
- Compression: Enabled for large objects (>1KB)
- Monitoring: Track hit rate, miss rate, eviction rate

---

### Feature 1.2: BullMQ Message Queue

**Objective:** Non-blocking background processing, handle long-running tasks

**Job Types:**

| Job Name | Duration | Priority | Retry |
|----------|----------|----------|-------|
| `parse-word-file` | 5-30s | High | 3 attempts |
| `bulk-import-quizzes` | 1-5min | Medium | 2 attempts |
| `calculate-leaderboard` | 2-10s | High | 3 attempts |
| `generate-analytics` | 10-30s | Low | 1 attempt |
| `send-email-notification` | 1-3s | High | 5 attempts |

**Queue Configuration:**
```typescript
{
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: false
  },
  limiter: {
    max: 10,        // Max 10 jobs
    duration: 1000  // Per second
  }
}
```

**Job Processing:**
```typescript
// Producer (API Controller)
await this.queueService.addJob('parse-word-file', {
  fileId: 'abc123',
  userId: 'user456'
});

// Return immediately
return { jobId: 'job789', status: 'processing' };

// Consumer (Background Worker)
@Process('parse-word-file')
async handleParse(job: Job) {
  const { fileId, userId } = job.data;
  await this.parseWordFile(fileId);
  await this.notifyUser(userId, 'Quiz ready!');
}
```

**UI Integration:**
```typescript
// Frontend polls job status
const checkStatus = async (jobId) => {
  const response = await fetch(`/api/jobs/${jobId}/status`);
  if (response.status === 'completed') {
    // Redirect to quiz
  } else if (response.status === 'failed') {
    // Show error
  } else {
    // Show progress: 45%
    setTimeout(() => checkStatus(jobId), 2000);
  }
};
```

---

### Feature 1.3: Rate Limiting

**Objective:** Protect system from abuse and DDoS attacks

**Rate Limit Rules:**

| Endpoint Pattern | Limit | Window | Action |
|------------------|-------|--------|--------|
| `*` (Global) | 100 req | 1 min | 429 status |
| `POST /auth/login` | 5 req | 15 min | 429 + log |
| `POST /files/upload` | 10 req | 1 hour | 429 |
| `POST /attempts/:id/submit` | 1 req | 5 min per quiz | 429 |
| `GET /quizzes` | 60 req | 1 min | 429 |

**Implementation:**
```typescript
// Global rate limit
@UseGuards(ThrottlerGuard)
@Controller()
export class AppController {}

// Custom rate limit
@Throttle(5, 60) // 5 requests per 60 seconds
@Post('login')
async login() {}

// Redis storage (shared across instances)
ThrottlerModule.forRoot({
  storage: new ThrottlerStorageRedisService(redis),
  throttlers: [{
    name: 'default',
    ttl: 60000,
    limit: 100
  }]
})
```

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1703001234
Retry-After: 45
```

---

### Feature 1.4: Structured Logging (Winston)

**Objective:** Searchable, structured logs for production debugging

**Log Levels:**
- `error`: System errors, exceptions
- `warn`: Degraded performance, deprecated usage
- `info`: Important business events
- `debug`: Detailed diagnostic information

**Log Structure:**
```json
{
  "timestamp": "2025-01-15T10:30:45.123Z",
  "level": "info",
  "message": "User completed quiz",
  "context": {
    "userId": "user123",
    "quizId": "quiz456",
    "score": 85,
    "timeSpent": 1234
  },
  "http": {
    "method": "POST",
    "url": "/api/attempts/abc/submit",
    "statusCode": 200,
    "userAgent": "Mozilla/5.0...",
    "ip": "192.168.1.100"
  },
  "requestId": "req-789",
  "duration": 145
}
```

**Transports:**
```typescript
// Console (development)
new winston.transports.Console({
  format: winston.format.simple()
})

// Daily rotate file (production)
new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
  format: winston.format.json()
})

// External service (optional)
new LokiTransport({
  host: 'http://loki:3100'
})
```

**Usage:**
```typescript
// Replace console.log
logger.info('User registered', { userId, email });

// Error logging
try {
  await this.service.doSomething();
} catch (error) {
  logger.error('Failed to do something', {
    error: error.message,
    stack: error.stack,
    userId
  });
}
```

---

### Feature 1.5: APM Integration (New Relic)

**Objective:** Real-time performance monitoring and alerting

**Tracked Metrics:**

**System Metrics:**
- API response times (p50, p95, p99)
- Database query duration
- Redis operation times
- External API call duration
- CPU usage, Memory usage, Disk I/O
- Network I/O

**Business Metrics:**
- Quiz attempts per minute
- User logins per hour
- File uploads per day
- Error rate by endpoint
- Active concurrent users

**Custom Events:**
```typescript
newrelic.recordCustomEvent('QuizCompleted', {
  userId: user.id,
  quizId: quiz.id,
  score: result.score,
  timeSpent: result.timeSpent,
  difficulty: quiz.difficulty
});
```

**Alerting Policies:**
```yaml
Alerts:
  - name: "High API Response Time"
    condition: "p95 response time > 1s for 5 minutes"
    severity: WARNING
    notification: email, slack

  - name: "High Error Rate"
    condition: "error rate > 5% for 2 minutes"
    severity: CRITICAL
    notification: pagerduty, slack

  - name: "High CPU Usage"
    condition: "CPU > 90% for 10 minutes"
    severity: WARNING
    notification: email
```

**Dashboard Widgets:**
1. Response Time Chart (24h)
2. Error Rate by Endpoint
3. Top 10 Slow Queries
4. Active Users (real-time)
5. Cache Hit/Miss Ratio
6. Queue Job Status
7. Database Connection Pool

---

### Feature 1.6: Auto-save Progress

**Objective:** Prevent data loss from browser crashes or accidental closure

**Auto-save Strategy:**

| Trigger | Action | Frequency |
|---------|--------|-----------|
| Answer selected | Save to localStorage | Immediate |
| Time elapsed | Save to backend | Every 30s |
| Page unload | Save to backend | On beforeunload |
| Question change | Save to backend | Immediate |

**Backend API:**
```typescript
PATCH /api/attempts/:id/progress
Body: {
  currentQuestionIndex: 5,
  answers: [
    { questionId: 'q1', optionId: 'opt1' },
    { questionId: 'q2', optionId: 'opt3' }
  ],
  timeSpent: 180
}
```

**Frontend Hook:**
```typescript
const useAutoSave = (attemptId, answers, currentIndex) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsSaving(true);
      await saveProgress(attemptId, answers, currentIndex);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [attemptId, answers, currentIndex]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress(attemptId, answers, currentIndex);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attemptId, answers, currentIndex]);

  return { lastSaved, isSaving };
};
```

**Recovery Flow:**
```typescript
// On page load
const savedProgress = localStorage.getItem(`attempt:${attemptId}`);
if (savedProgress) {
  const { answers, currentIndex, timestamp } = JSON.parse(savedProgress);
  const minutesAgo = (Date.now() - timestamp) / 60000;
  
  if (minutesAgo < 60) {
    // Show recovery dialog
    setShowRecoveryDialog(true);
  }
}
```

**UI Indicators:**
```tsx
<div className="auto-save-indicator">
  {isSaving ? (
    <span>💾 Saving...</span>
  ) : lastSaved ? (
    <span>✓ Saved {formatTimeAgo(lastSaved)}</span>
  ) : (
    <span>⚠️ Not saved yet</span>
  )}
</div>
```

---

## 🔧 Technical Tasks

### Backend (NestJS) - 10 days

#### Task 1.1: Redis Integration (3 days)

**Files to create/modify:**
```
backend/src/
├── cache/
│   ├── cache.module.ts          # NEW
│   ├── cache.service.ts         # NEW
│   ├── cache.interceptor.ts     # NEW
│   └── cache.config.ts          # NEW
├── common/
│   └── decorators/
│       └── cache-key.decorator.ts  # NEW
└── app.module.ts                # MODIFY
```

**Implementation Steps:**

1. **Install dependencies:**
```bash
npm install ioredis cache-manager cache-manager-ioredis-yet
```

2. **Create CacheModule:**
```typescript
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        ttl: 3600,
        max: 1000
      }),
      inject: [ConfigService]
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
```

3. **Create CacheService:**
```typescript
@Injectable()
export class CacheService {
  async get<T>(key: string): Promise<T | null>;
  async set(key: string, value: any, ttl?: number): Promise<void>;
  async del(key: string): Promise<void>;
  async invalidatePattern(pattern: string): Promise<void>;
  async getOrSet<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T>;
}
```

4. **Create Cache Interceptor:**
```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const key = this.generateCacheKey(context);
    const cached = await this.cacheService.get(key);
    if (cached) return of(cached);
    
    return next.handle().pipe(
      tap(response => this.cacheService.set(key, response))
    );
  }
}
```

5. **Add cache to existing services:**
```typescript
// QuizzesService
async findAll(categoryId?: string) {
  const cacheKey = `quiz:list:${categoryId || 'all'}`;
  return this.cacheService.getOrSet(cacheKey, async () => {
    return this.prisma.quiz.findMany({ where: { categoryId } });
  }, 3600);
}
```

**Testing:**
- Unit tests for CacheService
- Integration tests for cached endpoints
- Load test to measure cache hit rate

---

#### Task 1.2: BullMQ Integration (3 days)

**Files to create/modify:**
```
backend/src/
├── queue/
│   ├── queue.module.ts          # NEW
│   ├── queue.service.ts         # NEW
│   ├── processors/
│   │   ├── quiz.processor.ts    # NEW
│   │   └── analytics.processor.ts  # NEW
│   ├── jobs.controller.ts       # NEW
│   └── bull.config.ts           # NEW
└── quizzes/
    └── quizzes.service.ts       # MODIFY
```

**Implementation Steps:**

1. **Install dependencies:**
```bash
npm install @nestjs/bullmq bullmq
```

2. **Create QueueModule:**
```typescript
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue(
      { name: 'quiz-processing' },
      { name: 'analytics' }
    )
  ],
  providers: [QueueService, QuizProcessor, AnalyticsProcessor],
  exports: [QueueService]
})
export class QueueModule {}
```

3. **Create QueueService:**
```typescript
@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('quiz-processing') private quizQueue: Queue,
    @InjectQueue('analytics') private analyticsQueue: Queue
  ) {}

  async addJob(queueName: string, jobName: string, data: any) {
    const queue = this.getQueue(queueName);
    const job = await queue.add(jobName, data);
    return { jobId: job.id, status: 'queued' };
  }

  async getJobStatus(jobId: string) {
    // Find job across all queues
    const job = await this.findJob(jobId);
    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress,
      result: job.returnvalue
    };
  }
}
```

4. **Create Processors:**
```typescript
@Processor('quiz-processing')
export class QuizProcessor {
  @Process('parse-word-file')
  async handleParse(job: Job) {
    const { fileId, userId } = job.data;
    
    // Update progress
    job.updateProgress(10);
    
    // Parse file
    const quiz = await this.parseService.parseWordFile(fileId);
    job.updateProgress(70);
    
    // Save to database
    await this.quizzesService.create(quiz);
    job.updateProgress(100);
    
    // Notify user
    await this.notificationService.send(userId, 'Quiz ready!');
    
    return { quizId: quiz.id };
  }

  @OnQueueFailed()
  async handleFailed(job: Job, error: Error) {
    logger.error('Job failed', { jobId: job.id, error: error.message });
  }
}
```

5. **Update Controllers:**
```typescript
// QuizzesController
@Post('upload')
async uploadQuiz(@UploadedFile() file, @User() user) {
  // Save file
  const fileId = await this.filesService.save(file);
  
  // Queue processing
  const job = await this.queueService.addJob('quiz-processing', 'parse-word-file', {
    fileId,
    userId: user.id
  });
  
  // Return immediately
  return {
    jobId: job.jobId,
    status: 'processing',
    message: 'Quiz is being processed. We will notify you when ready.'
  };
}
```

6. **Create Job Status Endpoint:**
```typescript
@Controller('jobs')
export class JobsController {
  @Get(':id/status')
  async getStatus(@Param('id') jobId: string) {
    return this.queueService.getJobStatus(jobId);
  }
}
```

**Testing:**
- Unit tests for QueueService
- Integration tests for job processing
- Failure scenarios (retry logic)

---

#### Task 1.3: Rate Limiting (2 days)

**Files to create/modify:**
```
backend/src/
├── common/
│   ├── guards/
│   │   └── throttle.guard.ts    # NEW
│   ├── throttle-config.ts       # NEW
│   └── decorators/
│       └── throttle.decorator.ts  # NEW
└── auth/
    └── auth.controller.ts       # MODIFY
```

**Implementation Steps:**

1. **Install dependencies:**
```bash
npm install @nestjs/throttler @nestjs/throttler-storage-redis
```

2. **Configure ThrottlerModule:**
```typescript
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000,  // 1 minute
            limit: 100   // 100 requests
          }
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(config.get('REDIS_URL'))
        )
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

3. **Apply Global Guard:**
```typescript
// main.ts
app.useGlobalGuards(new ThrottlerGuard());
```

4. **Custom Rate Limits:**
```typescript
// Auth Controller
@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 per 15 min
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}

// File Upload
@Post('upload')
@Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 per hour
async upload(@UploadedFile() file) {
  return this.filesService.upload(file);
}
```

5. **Custom Decorators:**
```typescript
export const SkipThrottle = () => 
  SetMetadata('skipThrottle', true);

// Usage
@SkipThrottle()
@Get('public')
async publicEndpoint() {}
```

6. **Response Headers:**
```typescript
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-RateLimit-Limit', 100);
        response.setHeader('X-RateLimit-Remaining', 45);
        response.setHeader('X-RateLimit-Reset', Date.now() + 60000);
      })
    );
  }
}
```

**Testing:**
- Test rate limit enforcement
- Test header presence
- Test Redis storage
- Load test with multiple IPs

---

#### Task 1.4: Structured Logging (3 days)

**Files to create/modify:**
```
backend/src/
├── logger/
│   ├── logger.module.ts         # NEW
│   ├── logger.service.ts        # NEW
│   ├── logger.config.ts         # NEW
│   └── http-logger.middleware.ts  # NEW
├── common/
│   ├── filters/
│   │   └── exception.filter.ts  # MODIFY
│   └── interceptors/
│       └── logging.interceptor.ts  # NEW
└── main.ts                      # MODIFY
```

**Implementation Steps:**

1. **Install dependencies:**
```bash
npm install winston winston-daily-rotate-file
```

2. **Create Logger Configuration:**
```typescript
export const loggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    // Daily rotate file
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      maxSize: '20m'
    }),
    // Error file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  ]
};
```

3. **Create LoggerService:**
```typescript
@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(loggerConfig);
  }

  info(message: string, context?: any) {
    this.logger.info(message, { ...context, timestamp: new Date() });
  }

  error(message: string, trace?: string, context?: any) {
    this.logger.error(message, { trace, ...context });
  }

  warn(message: string, context?: any) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: any) {
    this.logger.debug(message, context);
  }
}
```

4. **Create HTTP Logger Middleware:**
```typescript
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    req['requestId'] = requestId;

    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.info('HTTP Request', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
    });

    next();
  }
}
```

5. **Update Exception Filter:**
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception?.status || 500;

    this.logger.error('Exception thrown', exception.stack, {
      requestId: request['requestId'],
      method: request.method,
      url: request.url,
      statusCode: status,
      userId: request.user?.id,
      error: exception.message
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message
    });
  }
}
```

6. **Replace console.log:**
```bash
# Find and replace all console.log
grep -r "console.log" src/ | wc -l
# Replace with logger.info, logger.error, etc.
```

**Testing:**
- Verify logs written to files
- Check log rotation works
- Verify structured format
- Test correlation IDs work

---

#### Task 1.5: APM Integration (2 days)

**Files to create/modify:**
```
backend/
├── newrelic.js                  # NEW
├── src/
│   ├── monitoring/
│   │   ├── monitoring.module.ts  # NEW
│   │   └── monitoring.service.ts  # NEW
│   └── main.ts                  # MODIFY
└── package.json                 # MODIFY
```

**Implementation Steps:**

1. **Install New Relic:**
```bash
npm install newrelic
```

2. **Create newrelic.js:**
```javascript
'use strict';

exports.config = {
  app_name: ['QuizMaster'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
};
```

3. **Import in main.ts:**
```typescript
// MUST be first import
import * as newrelic from 'newrelic';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ... rest of bootstrap
}
```

4. **Create Monitoring Service:**
```typescript
@Injectable()
export class MonitoringService {
  recordCustomEvent(eventType: string, attributes: any) {
    newrelic.recordCustomEvent(eventType, attributes);
  }

  recordMetric(name: string, value: number) {
    newrelic.recordMetric(name, value);
  }

  noticeError(error: Error, customAttributes?: any) {
    newrelic.noticeError(error, customAttributes);
  }

  startWebTransaction(name: string, handler: () => Promise<any>) {
    return newrelic.startWebTransaction(name, handler);
  }
}
```

5. **Add Custom Instrumentation:**
```typescript
// In services
async completeQuiz(attemptId: string, userId: string) {
  const segment = newrelic.startSegment('completeQuiz', true, () => {
    // Business logic
  });

  // Record custom event
  this.monitoring.recordCustomEvent('QuizCompleted', {
    userId,
    attemptId,
    duration: segment.getDurationInMillis()
  });
}
```

6. **Configure Alerts:**
```yaml
# alert_policies.yml
- name: "High API Response Time"
  condition:
    metric: "Apdex/Transaction/WebTransaction"
    operator: "below"
    threshold: 0.5
    duration: 300
  notification_channels:
    - email
    - slack
```

**Testing:**
- Verify data appears in New Relic dashboard
- Test custom events
- Verify error tracking
- Test alert notifications

---

#### Task 1.6: Auto-save Endpoint (2 days)

**Files to create/modify:**
```
backend/src/
└── attempts/
    ├── dto/
    │   └── update-progress.dto.ts  # NEW
    ├── attempts.controller.ts      # MODIFY
    └── attempts.service.ts         # MODIFY
```

**Implementation Steps:**

1. **Create DTO:**
```typescript
export class UpdateProgressDto {
  @IsInt()
  currentQuestionIndex: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsInt()
  timeSpent: number;
}

class AnswerDto {
  @IsUUID()
  questionId: string;

  @IsUUID()
  optionId: string;
}
```

2. **Add Controller Endpoint:**
```typescript
@Patch(':id/progress')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 120, ttl: 60000 } }) // 2 per second max
async updateProgress(
  @Param('id') id: string,
  @Body() dto: UpdateProgressDto,
  @User() user: UserEntity
) {
  return this.attemptsService.updateProgress(id, dto, user.id);
}
```

3. **Add Service Method:**
```typescript
async updateProgress(
  attemptId: string,
  dto: UpdateProgressDto,
  userId: string
) {
  // Verify ownership
  const attempt = await this.findOne(attemptId);
  if (attempt.userId !== userId) {
    throw new ForbiddenException();
  }

  // Update progress
  return this.prisma.quizAttempt.update({
    where: { id: attemptId },
    data: {
      currentQuestionIndex: dto.currentQuestionIndex,
      answers: dto.answers,
      timeSpent: dto.timeSpent,
      lastAutoSaved: new Date()
    }
  });
}
```

4. **Add Database Field:**
```prisma
model QuizAttempt {
  // ... existing fields
  currentQuestionIndex Int?
  lastAutoSaved DateTime?
}
```

**Testing:**
- Test save endpoint works
- Test rate limiting
- Test ownership validation
- Test concurrent saves

---

### Frontend (React) - 2 days

#### Task 1.7: Auto-save Hook & UI (2 days)

**Files to create/modify:**
```
frontend/src/
├── hooks/
│   └── useAutoSave.ts           # NEW
├── components/
│   ├── SaveIndicator.tsx        # NEW
│   └── RecoveryDialog.tsx       # NEW
└── pages/
    └── QuizRunner.tsx           # MODIFY
```

**Implementation Steps:**

1. **Create useAutoSave Hook:**
```typescript
export const useAutoSave = (
  attemptId: string,
  answers: Answer[],
  currentIndex: number
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProgress = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);

      await attemptService.updateProgress(attemptId, {
        currentQuestionIndex: currentIndex,
        answers,
        timeSpent: calculateTimeSpent()
      });

      setLastSaved(new Date());
      
      // Also save to localStorage as backup
      localStorage.setItem(`attempt:${attemptId}`, JSON.stringify({
        answers,
        currentIndex,
        timestamp: Date.now()
      }));
    } catch (err) {
      setError('Failed to save progress');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, [attemptId, answers, currentIndex]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [saveProgress]);

  // Save on answer change
  useEffect(() => {
    const debounced = debounce(saveProgress, 2000);
    debounced();
    return () => debounced.cancel();
  }, [answers]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answers.length > 0) {
        saveProgress();
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers, saveProgress]);

  return { lastSaved, isSaving, error, saveNow: saveProgress };
};
```

2. **Create SaveIndicator Component:**
```typescript
export const SaveIndicator: React.FC<{
  lastSaved: Date | null;
  isSaving: boolean;
  error: string | null;
}> = ({ lastSaved, isSaving, error }) => {
  if (error) {
    return (
      <div className="save-indicator error">
        <AlertCircle size={16} />
        <span>{error}</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="save-indicator saving">
        <Loader size={16} className="animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="save-indicator saved">
        <Check size={16} />
        <span>Saved {formatTimeAgo(lastSaved)}</span>
      </div>
    );
  }

  return null;
};
```

3. **Create RecoveryDialog Component:**
```typescript
export const RecoveryDialog: React.FC<{
  open: boolean;
  onRecover: () => void;
  onDiscard: () => void;
  savedData: any;
}> = ({ open, onRecover, onDiscard, savedData }) => {
  if (!open) return null;

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recover Previous Progress?</DialogTitle>
          <DialogDescription>
            We found unsaved progress from {formatTimeAgo(savedData.timestamp)}.
            You answered {savedData.answers.length} questions.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onDiscard}>
            Start Fresh
          </Button>
          <Button onClick={onRecover}>
            Recover Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

4. **Integrate in QuizRunner:**
```typescript
export const QuizRunner: React.FC = () => {
  const { attemptId } = useParams();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);

  // Auto-save hook
  const { lastSaved, isSaving, error } = useAutoSave(
    attemptId!,
    answers,
    currentIndex
  );

  // Check for saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(`attempt:${attemptId}`);
    if (saved) {
      const data = JSON.parse(saved);
      const minutesAgo = (Date.now() - data.timestamp) / 60000;
      
      if (minutesAgo < 60 && data.answers.length > 0) {
        setShowRecovery(true);
        setSavedData(data);
      }
    }
  }, [attemptId]);

  const handleRecover = () => {
    setAnswers(savedData.answers);
    setCurrentIndex(savedData.currentIndex);
    setShowRecovery(false);
  };

  const handleDiscard = () => {
    localStorage.removeItem(`attempt:${attemptId}`);
    setShowRecovery(false);
  };

  return (
    <div className="quiz-runner">
      {/* Save indicator in header */}
      <div className="quiz-header">
        <h1>Quiz in Progress</h1>
        <SaveIndicator
          lastSaved={lastSaved}
          isSaving={isSaving}
          error={error}
        />
      </div>

      {/* Recovery dialog */}
      <RecoveryDialog
        open={showRecovery}
        onRecover={handleRecover}
        onDiscard={handleDiscard}
        savedData={savedData}
      />

      {/* Quiz questions */}
      {/* ... */}
    </div>
  );
};
```

**Testing:**
- Test auto-save every 30s
- Test save on answer change
- Test recovery dialog
- Test localStorage backup
- Test page unload warning

---

### DevOps - 1.5 days

#### Task 1.8: Docker Compose Updates (1 day)

**Files to create/modify:**
```
docker-compose.yml               # MODIFY
.env.example                     # MODIFY
```

**Implementation:**

```yaml
version: '3.8'

services:
  # Existing services
  postgres:
    image: postgres:16
    # ... existing config

  backend:
    build: ./backend
    # ... existing config
    environment:
      - REDIS_URL=redis://redis:6379
      - NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    # ... existing config

  # NEW: Redis
  redis:
    image: redis:7-alpine
    container_name: quizmaster-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # NEW: Redis Commander (Optional - for debugging)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: quizmaster-redis-ui
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis

volumes:
  postgres-data:
  redis-data:
```

**.env.example:**
```bash
# Existing vars
DATABASE_URL=postgresql://...

# NEW
REDIS_URL=redis://localhost:6379
NEW_RELIC_LICENSE_KEY=your_key_here
LOG_LEVEL=info
```

**Testing:**
- Test docker-compose up
- Test Redis connectivity
- Test data persistence
- Test health checks

---

#### Task 1.9: Nginx Caching (0.5 day)

**Files to create/modify:**
```
nginx/
├── nginx.conf                   # MODIFY
└── cache.conf                   # NEW
```

**Implementation:**

```nginx
# cache.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;

# nginx.conf
http {
  include cache.conf;

  upstream backend {
    server backend:3000;
  }

  server {
    listen 80;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
      proxy_pass http://backend;
      proxy_cache api_cache;
      proxy_cache_valid 200 7d;
      add_header X-Cache-Status $upstream_cache_status;
    }

    # Cache GET requests to /api/quizzes
    location /api/quizzes {
      proxy_pass http://backend;
      proxy_cache api_cache;
      proxy_cache_valid 200 5m;
      proxy_cache_bypass $http_x_no_cache;
      add_header X-Cache-Status $upstream_cache_status;
    }

    # Don't cache authenticated requests
    location /api {
      proxy_pass http://backend;
      proxy_cache_bypass $http_authorization;
    }

    # Cache purge endpoint
    location ~ /purge(/.*) {
      allow 127.0.0.1;
      deny all;
      proxy_cache_purge api_cache $scheme$proxy_host$1;
    }
  }
}
```

**Testing:**
- Test cache headers
- Test cache hit/miss
- Test cache purge
- Test auth bypass

---

## ✅ Acceptance Criteria

### Performance Metrics

- [ ] **API Response Time**
  - p50: <50ms (from 100ms)
  - p95: <100ms (from 200ms)
  - p99: <200ms (from 500ms)

- [ ] **Cache Performance**
  - Hit rate: >80%
  - Redis operations: <5ms p95
  - Cache memory usage: <500MB

- [ ] **Background Jobs**
  - File parsing: <30s for 50-question quiz
  - No blocking API calls
  - Failed jobs retry automatically

- [ ] **Rate Limiting**
  - Global limit enforced: 100 req/min
  - Login limit enforced: 5 req/15min
  - 429 status returned with proper headers

### Reliability Metrics

- [ ] **Logging**
  - All errors logged with full context
  - Logs searchable in <1 second
  - Log files rotate daily
  - No console.log in production code

- [ ] **Monitoring**
  - New Relic dashboard operational
  - All critical metrics visible
  - Alerts configured and tested
  - Custom events tracking business metrics

- [ ] **Auto-save**
  - Progress saved every 30 seconds
  - Save indicator shows status
  - Recovery dialog appears after crash
  - LocalStorage backup works

### Operational Metrics

- [ ] **Deployment**
  - Zero downtime deployment successful
  - Docker compose up works first try
  - All services healthy
  - Health check endpoints working

- [ ] **Scalability**
  - System stable with 50 concurrent users
  - No memory leaks after 24h operation
  - Database connections properly pooled
  - Redis memory usage stable

---

## ⚠️ Risks & Mitigation

### Risk 1: Redis Integration Breaks Existing Features

**Probability:** Medium  
**Impact:** High

**Mitigation:**
1. **Feature flag:** Enable Redis for 10% of requests first
2. **Gradual rollout:** 10% → 50% → 100% over 3 days
3. **Fallback:** Automatic fallback to direct DB on Redis failure
4. **Rollback script:** Disable Redis with one command
5. **Monitoring:** Alert if cache hit rate <50%

**Rollback Plan:**
```typescript
// Feature flag
if (process.env.ENABLE_REDIS === 'false') {
  return this.prisma.findMany(); // Direct DB
}
// Use cache
return this.cacheService.getOrSet(key, () => this.prisma.findMany());
```

---

### Risk 2: BullMQ Job Failures

**Probability:** Medium  
**Impact:** Medium

**Mitigation:**
1. **Retry logic:** 3 attempts with exponential backoff
2. **Dead letter queue:** Failed jobs moved to separate queue
3. **Notifications:** Email admin on repeated failures
4. **Manual retry:** Admin UI to retry failed jobs
5. **Monitoring:** Alert if failed jobs >5% in 1 hour

**Recovery:**
```typescript
// Admin can manually retry
@Post('jobs/:id/retry')
async retryJob(@Param('id') jobId: string) {
  const job = await this.queue.getJob(jobId);
  await job.retry();
}
```

---

### Risk 3: Rate Limiting Too Aggressive

**Probability:** Medium  
**Impact:** Low

**Mitigation:**
1. **Conservative limits:** Start with generous limits
2. **Monitoring:** Track rate limit hit rate
3. **Configurable:** Adjust via environment variables
4. **Whitelist:** Allow internal IPs to bypass
5. **Gradual tightening:** Reduce limits over time

**Configuration:**
```bash
# Start generous
RATE_LIMIT_GLOBAL=200  # per minute

# Monitor for 1 week

# Tighten gradually
RATE_LIMIT_GLOBAL=150
# ... wait 3 days ...
RATE_LIMIT_GLOBAL=100
```

---

### Risk 4: APM Overhead Impact Performance

**Probability:** Low  
**Impact:** Medium

**Mitigation:**
1. **Sampling:** Only track 10% of transactions
2. **Async reporting:** Don't block requests
3. **Disable in dev:** Only enable in staging/production
4. **Resource limits:** Cap APM agent memory usage
5. **Monitoring:** Alert if APM adds >20ms latency

**Configuration:**
```javascript
// newrelic.js
exports.config = {
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 0.5,  // Only slow transactions
    record_sql: 'obfuscated'
  },
  distributed_tracing: {
    enabled: true
  }
};
```

---

### Risk 5: Auto-save Creates Database Hotspot

**Probability:** Low  
**Impact:** Low

**Mitigation:**
1. **Rate limiting:** Max 2 saves per second per user
2. **Debouncing:** Don't save on every keystroke
3. **Batch updates:** Combine multiple saves
4. **Database indexing:** Index attemptId + userId
5. **Monitoring:** Track save operation duration

**Optimization:**
```typescript
// Debounce saves
const debouncedSave = debounce(saveProgress, 2000);

// Rate limit
@Throttle({ default: { limit: 120, ttl: 60000 } })
async updateProgress() {}
```

---

## 📅 Timeline

### Week 1: Backend Infrastructure (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Redis integration | Backend Dev 1 | 8 |
| Tue | Redis integration (cont) | Backend Dev 1 | 8 |
| Wed | BullMQ integration | Backend Dev 2 | 8 |
| Thu | BullMQ integration (cont) | Backend Dev 2 | 8 |
| Fri | Rate limiting | Backend Dev 1 | 8 |

**Deliverable:** Redis, BullMQ, Rate Limiting operational

---

### Week 2: Observability (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Winston logging setup | Backend Dev 1 | 8 |
| Tue | Replace console.log | Backend Dev 1 | 8 |
| Wed | New Relic integration | Backend Dev 2 | 8 |
| Thu | Custom instrumentation | Backend Dev 2 | 8 |
| Fri | Testing & validation | Both | 8 |

**Deliverable:** Structured logging, APM monitoring operational

---

### Week 3: Auto-save & DevOps (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Auto-save backend | Backend Dev 1 | 8 |
| Tue | Auto-save frontend | Frontend Dev | 8 |
| Wed | Recovery dialog | Frontend Dev | 8 |
| Thu | Docker compose updates | DevOps | 8 |
| Fri | Nginx caching | DevOps | 8 |

**Deliverable:** Auto-save feature, updated infrastructure

---

### Week 4: Testing & Deployment (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Performance testing | QA + DevOps | 8 |
| Tue | Load testing (50 users) | QA + DevOps | 8 |
| Wed | Bug fixes | All | 8 |
| Thu | Documentation | All | 8 |
| Fri | Production deployment | DevOps | 8 |

**Deliverable:** Phase 1 complete, production-ready

---

## 📦 Deliverables

### Code Deliverables

```
backend/src/
├── cache/
│   ├── cache.module.ts
│   ├── cache.service.ts
│   ├── cache.interceptor.ts
│   └── cache.config.ts
├── queue/
│   ├── queue.module.ts
│   ├── queue.service.ts
│   ├── processors/
│   │   ├── quiz.processor.ts
│   │   └── analytics.processor.ts
│   ├── jobs.controller.ts
│   └── bull.config.ts
├── logger/
│   ├── logger.module.ts
│   ├── logger.service.ts
│   ├── logger.config.ts
│   └── http-logger.middleware.ts
├── monitoring/
│   ├── monitoring.module.ts
│   └── monitoring.service.ts
├── common/
│   ├── guards/
│   │   └── throttle.guard.ts
│   ├── throttle-config.ts
│   └── filters/
│       └── exception.filter.ts (updated)
└── attempts/
    ├── dto/
    │   └── update-progress.dto.ts
    ├── attempts.controller.ts (updated)
    └── attempts.service.ts (updated)

frontend/src/
├── hooks/
│   └── useAutoSave.ts
├── components/
│   ├── SaveIndicator.tsx
│   └── RecoveryDialog.tsx
└── pages/
    └── QuizRunner.tsx (updated)

infrastructure/
├── docker-compose.yml (updated)
├── nginx/
│   ├── nginx.conf (updated)
│   └── cache.conf
└── newrelic.js
```

---

### Documentation Deliverables

1. **Redis Setup Guide**
   - Installation instructions
   - Configuration options
   - Cache key patterns
   - Invalidation strategies
   - Troubleshooting

2. **Queue Management Guide**
   - Job types and configs
   - Adding new jobs
   - Monitoring job status
   - Handling failures
   - Scaling workers

3. **Logging Guide**
   - Log levels and usage
   - Log structure
   - Searching logs
   - Correlation IDs
   - Best practices

4. **Monitoring Guide**
   - New Relic dashboard
   - Key metrics to watch
   - Alert policies
   - Custom events
   - Performance optimization

5. **Deployment Guide**
   - Pre-deployment checklist
   - Deployment steps
   - Rollback procedure
   - Health checks
   - Post-deployment validation

---

### Performance Report

**Before Phase 1:**
```
API Response Time:
  p50: 100ms
  p95: 200ms
  p99: 500ms

Concurrent Users: 20 (max)
Cache Hit Rate: 0%
Uptime: 99%
Error Visibility: Low (console.log only)
Background Jobs: Block API calls
Rate Limiting: None
```

**After Phase 1:**
```
API Response Time:
  p50: <50ms  (2x faster)
  p95: <100ms (2x faster)
  p99: <200ms (2.5x faster)

Concurrent Users: 50+ (2.5x increase)
Cache Hit Rate: >80%
Uptime: 99.9%
Error Visibility: High (structured logs, APM)
Background Jobs: Non-blocking, tracked
Rate Limiting: Protected
```

**Improvement Summary:**
- ⚡ 2x faster response times
- 📈 2.5x more concurrent users
- 💾 80% reduction in database load
- 🔍 10x better observability
- 🛡️ DDoS protection enabled
- 💪 Production-grade reliability

---

## 🎯 Success Criteria

Phase 1 is considered **COMPLETE** when:

### Technical Criteria
- ✅ All 6 features implemented and tested
- ✅ Redis cache hit rate >80%
- ✅ BullMQ processing all background jobs
- ✅ Rate limiting enforced on all endpoints
- ✅ All logs structured and searchable
- ✅ New Relic dashboard showing real-time metrics
- ✅ Auto-save working with recovery

### Performance Criteria
- ✅ API p95 response time <100ms
- ✅ System stable with 50 concurrent users
- ✅ Zero downtime deployment successful
- ✅ No memory leaks after 24h operation

### Operational Criteria
- ✅ All documentation complete
- ✅ Team trained on new systems
- ✅ Monitoring alerts configured
- ✅ Production deployment successful
- ✅ No critical bugs in first week

### Business Criteria
- ✅ User complaints about speed: 0
- ✅ Admin productivity: +20%
- ✅ System uptime: 99.9%
- ✅ Ready for Phase 2 features

---

## 🔄 Transition to Phase 2

**Prerequisites for Phase 2:**
1. ✅ Phase 1 complete and stable
2. ✅ All acceptance criteria met
3. ✅ Team comfortable with new infrastructure
4. ✅ No critical issues in production

**Phase 2 Dependencies:**
- Redis cache (for shuffle feature)
- Background jobs (for analytics)
- Structured logging (for debugging new features)
- APM (for monitoring user experience)

**Recommendation:** Wait 1 week after Phase 1 deployment before starting Phase 2 to ensure stability.

---

## 📞 Support & Escalation

**During Phase 1 Implementation:**

**Technical Questions:**
- Backend: @backend-lead
- DevOps: @devops-lead
- Redis: @cache-expert

**Blockers:**
- Report in #phase1-blockers Slack channel
- Tag @tech-lead for escalation

**Daily Standup:**
- Time: 10:00 AM
- Duration: 15 minutes
- Focus: Progress, blockers, coordination

**Weekly Review:**
- Time: Friday 4:00 PM
- Review: Week progress, next week plan
- Attendees: All team + stakeholders

---

**Status:** ✅ Ready for Implementation  
**Priority:** 🔴 CRITICAL  
**Next Step:** Assign tasks, kickoff meeting, begin Week 1

