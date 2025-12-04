# 📦 PHASE 1: PERFORMANCE & STABILITY FOUNDATION

**Duration:** 3-4 weeks  
**Priority:** 🔴 CRITICAL  
**Team Size:** 2-3 Backend developers + 1 DevOps  
**Status:** Ready to Start

---

## 📋 TABLE OF CONTENTS

1. [Summary](#summary)
2. [Objective](#objective)
3. [Why This Phase](#why-this-phase)
4. [Scope](#scope)
5. [User Stories](#user-stories)
6. [Feature Breakdown](#feature-breakdown)
7. [Technical Tasks](#technical-tasks)
8. [Database Changes](#database-changes)
9. [Acceptance Criteria](#acceptance-criteria)
10. [Risks & Mitigation](#risks--mitigation)
11. [Timeline](#timeline)
12. [Deliverables](#deliverables)

---

## 📝 SUMMARY

Phase 1 establishes a rock-solid infrastructure foundation by implementing caching, message queuing, monitoring, and auto-save functionality. This phase is **critical** as it addresses performance bottlenecks that will worsen as user count grows.

**Key Focus Areas:**
- 🚀 Performance optimization (4x improvement target)
- 📊 Observability (logging, monitoring, APM)
- 🔒 Security (rate limiting)
- 💾 User experience (auto-save)

---

## 🎯 OBJECTIVE

**Primary Goal:**  
Transform QuizMaster from a functional system into a **high-performance, production-grade** application that can scale from 20 to 100+ concurrent users without degradation.

**Specific Objectives:**
1. Reduce API response time from 200ms to <100ms (p95)
2. Implement comprehensive monitoring and logging
3. Protect against DDoS and API abuse
4. Enable background job processing for long-running tasks
5. Prevent user data loss with auto-save

---

## 🤔 WHY THIS PHASE

### Current Pain Points

**Performance Issues:**
- Database queries run on every request (no caching)
- Word file parsing blocks API for 10-30 seconds
- Bulk operations can timeout
- No query optimization

**Operational Blindness:**
- `console.log` debugging in production
- No visibility into bottlenecks
- Cannot track user journeys
- Errors go unnoticed until reported

**Security Gaps:**
- No rate limiting → vulnerable to abuse
- No protection against brute force login
- No request throttling

**User Frustration:**
- Lost quiz progress on browser crash
- No way to continue interrupted quiz
- Manual save required

### Business Impact Without This Phase

- ❌ Cannot scale beyond 20 concurrent users
- ❌ Production issues take hours to debug
- ❌ Risk of DDoS taking down the system
- ❌ Users lose work → negative reviews
- ❌ Admin operations blocked by slow imports

---

## 📦 SCOPE

### ✅ In Scope

**Infrastructure:**
- Redis caching layer
- BullMQ message queue
- Rate limiting middleware
- Structured logging (Winston)
- APM integration (New Relic or Datadog)

**Backend:**
- Caching service with invalidation
- Queue service for background jobs
- Rate limiter with configurable limits
- Logger with context and search

**Frontend:**
- Auto-save hook for quiz progress
- Recovery mechanism for interrupted quizzes

**DevOps:**
- Docker Compose updates for Redis
- Nginx caching configuration
- Monitoring dashboard setup

### ❌ Out of Scope

- New user-facing features (Phase 2)
- Admin tools improvements (Phase 3)
- UI/UX redesign
- Database schema changes (except caching tables)
- Mobile app development

---

## 👥 USER STORIES

### As a **User**

**US-1.1: Auto-save Progress**
```
As a student taking a quiz,
I want my answers to be automatically saved,
So that I don't lose my progress if my browser crashes.

Acceptance:
- Answers saved every 30 seconds
- Recovery prompt on page reload
- Works offline (LocalStorage)
- Syncs when connection restored
```

**US-1.2: Fast Page Loads**
```
As a user browsing quizzes,
I want pages to load instantly,
So that I can focus on learning instead of waiting.

Acceptance:
- Quiz list loads in <500ms
- Quiz details loads in <200ms
- No loading spinners for cached data
```

### As an **Admin**

**US-1.3: Non-blocking File Upload**
```
As an admin uploading a quiz file,
I want to continue working while the file is being processed,
So that I don't waste time waiting for imports.

Acceptance:
- Upload returns immediately with job ID
- Progress notification shown
- Can upload multiple files concurrently
- Notification when complete
```

**US-1.4: System Health Visibility**
```
As an admin,
I want to see system health metrics in real-time,
So that I can proactively address issues.

Acceptance:
- Dashboard shows response times
- Error rate visible
- Cache hit rate displayed
- Alerts on anomalies
```

### As a **Developer**

**US-1.5: Searchable Logs**
```
As a developer debugging a production issue,
I want to search logs by user ID, endpoint, and time,
So that I can quickly identify the root cause.

Acceptance:
- Logs structured in JSON
- Searchable by multiple fields
- Includes request/response context
- Retention for 30 days
```

**US-1.6: Performance Insights**
```
As a developer optimizing the system,
I want to identify slow queries and bottlenecks,
So that I can prioritize optimization efforts.

Acceptance:
- APM shows slow transactions
- Database query times tracked
- Distributed tracing enabled
- p50, p95, p99 metrics visible
```

---

## 🎨 FEATURE BREAKDOWN

### Feature 1: Redis Caching Layer

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 5 days

**Description:**  
Implement Redis as a caching layer to store frequently accessed data and reduce database load.

**Cache Strategies:**

```typescript
// Cache Keys Structure
user:sessions:{userId}           // TTL: 24h
quizzes:list:page:{page}        // TTL: 1h
quizzes:detail:{quizId}         // TTL: 1h
questions:{quizId}              // TTL: 2h
leaderboard:{period}            // TTL: 5m
categories:list                 // TTL: 1 day
user:profile:{userId}           // TTL: 1h
analytics:quiz:{quizId}         // TTL: 15m
```

**Invalidation Rules:**
- Quiz updated → invalidate `quizzes:detail:{id}`, `quizzes:list:*`, `questions:{id}`
- User profile updated → invalidate `user:profile:{userId}`
- Quiz completed → invalidate `leaderboard:*`, `analytics:*`
- Category changed → invalidate `categories:list`, related quizzes

**Technical Requirements:**
- Redis 7.x with persistence enabled
- redis-om for TypeScript support
- Connection pooling (min: 5, max: 20)
- Automatic reconnection on failure
- Health check endpoint

---

### Feature 2: BullMQ Message Queue

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 5 days

**Description:**  
Implement background job processing for long-running tasks to prevent API blocking.

**Job Types:**

```typescript
// Queue: quiz-processing
Job: parse-word-file
- Input: { fileName, fileBuffer, userId }
- Duration: 5-30s
- Retry: 3 attempts
- Priority: HIGH

Job: bulk-import-quizzes
- Input: { files[], categoryId, userId }
- Duration: 1-5 minutes
- Retry: 2 attempts
- Priority: MEDIUM

// Queue: analytics
Job: calculate-leaderboard
- Schedule: Every 5 minutes
- Duration: 2-10s
- Retry: 1 attempt
- Priority: LOW

Job: generate-user-report
- Input: { userId, period }
- Duration: 10-30s
- Retry: 2 attempts
- Priority: MEDIUM

// Queue: notifications (future)
Job: send-email
- Input: { to, subject, body }
- Retry: 5 attempts
- Priority: HIGH
```

**Queue Configuration:**
```typescript
// bull-config.ts
{
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100,  // Keep last 100 completed
    removeOnFail: 500       // Keep last 500 failed
  },
  limiter: {
    max: 10,                // Max 10 jobs
    duration: 1000          // Per second
  }
}
```

**UI Integration:**
- Job status polling endpoint
- Progress notification component
- Job history in admin panel

---

### Feature 3: Rate Limiting

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 2 days

**Description:**  
Implement rate limiting to prevent API abuse and protect system resources.

**Rate Limit Rules:**

```typescript
// Global limits (per IP)
'*': {
  windowMs: 60 * 1000,      // 1 minute
  max: 100                   // 100 requests
}

// Authentication endpoints
'/api/auth/login': {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts
  skipSuccessfulRequests: true
}

'/api/auth/register': {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3                     // 3 registrations
}

// File upload
'/api/quizzes/import': {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10                    // 10 uploads
}

// Quiz submission
'/api/attempts/:id/submit': {
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 1,                    // 1 submission per quiz
  keyGenerator: (req) => `${req.user.id}-${req.params.id}`
}

// API calls (authenticated users)
'/api/*': {
  windowMs: 60 * 1000,      // 1 minute
  max: 60,                   // 60 requests
  keyGenerator: (req) => req.user.id
}
```

**Storage:** Redis (shared across instances)  
**Response Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1638360000
Retry-After: 15
```

---

### Feature 4: Structured Logging

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 3 days

**Description:**  
Replace console.log with structured logging for production debugging.

**Log Levels:**
- `error`: Exceptions, failed requests
- `warn`: Deprecated usage, near-limit conditions
- `info`: Important business events
- `debug`: Detailed flow (dev only)

**Log Structure:**

```json
{
  "timestamp": "2025-12-04T10:30:15.123Z",
  "level": "error",
  "message": "Failed to parse quiz file",
  "context": {
    "userId": "uuid-123",
    "endpoint": "/api/quizzes/import",
    "method": "POST",
    "statusCode": 500,
    "fileName": "quiz.docx",
    "error": {
      "name": "ParseError",
      "message": "Invalid format",
      "stack": "..."
    }
  },
  "requestId": "req-abc-123",
  "duration": 1234
}
```

**Transport Targets:**
- Console (dev environment)
- File rotation (7 days retention)
- External service (Loki/ELK) - optional

**Usage Example:**
```typescript
// Before
console.log('User logged in:', userId);

// After
logger.info('User logged in', {
  userId,
  email: user.email,
  lastLoginAt: user.lastActiveAt
});
```

---

### Feature 5: APM (Application Performance Monitoring)

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 2 days

**Description:**  
Integrate APM tool for real-time performance monitoring and alerting.

**Recommended Tools:**
- **New Relic** (generous free tier, easy setup)
- **Datadog** (comprehensive, expensive)
- **Elastic APM** (open-source, self-hosted)

**Tracked Metrics:**

```typescript
// Performance
- API response times (p50, p95, p99)
- Database query times
- Redis operation times
- External API calls

// Business
- Quiz attempts per minute
- User logins per hour
- File uploads per day
- Error rate by endpoint

// Infrastructure
- CPU usage
- Memory usage
- Disk I/O
- Network traffic

// Custom Events
- Quiz completed
- User registered
- Admin action performed
```

**Alerting Rules:**
```yaml
# Critical alerts
- API response time p95 > 1s for 5 minutes
- Error rate > 5% for 2 minutes
- CPU usage > 90% for 10 minutes

# Warning alerts
- Cache hit rate < 70% for 30 minutes
- Database connections > 80% pool
- Queue backlog > 100 jobs
```

**Dashboard Widgets:**
- Response time chart (last 24h)
- Error rate by endpoint
- Top 10 slow queries
- Active users (real-time)
- Cache hit/miss ratio

---

### Feature 6: Auto-save Progress (User Feature)

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 3 days

**Description:**  
Automatically save user quiz progress to prevent data loss.

**Implementation Strategy:**

**Backend:**
```typescript
// New endpoint
PATCH /api/attempts/:id/progress

// Request
{
  currentQuestionIndex: 5,
  answers: [
    { questionId: 'q1', selectedOptionId: 'opt-a' },
    { questionId: 'q2', selectedOptionId: 'opt-c' }
  ],
  timeSpent: 300  // seconds
}

// Response (no-op, just 200 OK)
```

**Frontend Hook:**
```typescript
// useAutoSave.ts
const useAutoSave = (attemptId: string) => {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  
  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) {
        saveProgress();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isDirty]);
  
  // Save before unload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        saveProgress();
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
  
  return { isDirty, lastSaved, markDirty, saveNow };
};
```

**LocalStorage Backup:**
```typescript
// Save to localStorage as backup
localStorage.setItem(`quiz-progress-${attemptId}`, JSON.stringify({
  answers,
  currentIndex,
  timestamp: Date.now()
}));

// Recovery prompt on mount
if (localStorage.getItem(`quiz-progress-${attemptId}`)) {
  // Show recovery dialog
}
```

**UI Indicators:**
```tsx
// Save status indicator
<div className="text-sm text-gray-500">
  {isSaving && <Spinner /> 'Saving...'}
  {lastSaved && `Last saved ${formatTimeAgo(lastSaved)}`}
  {error && <Error>Failed to save</Error>}
</div>
```

---

## 🔧 TECHNICAL TASKS

### Backend Tasks (NestJS)

#### Task 1.1: Redis Integration (3 days)

**Subtasks:**
- [ ] Add Redis Docker service to docker-compose.yml
- [ ] Install dependencies: `ioredis`, `cache-manager`, `cache-manager-ioredis-yet`
- [ ] Create `CacheModule` with configuration
- [ ] Create `CacheService` with methods:
  - `get(key: string): Promise<T | null>`
  - `set(key: string, value: T, ttl?: number): Promise<void>`
  - `del(key: string): Promise<void>`
  - `invalidate(pattern: string): Promise<void>`
- [ ] Update `QuizzesService` to use cache:
  ```typescript
  async findAll(query: FindAllQuizzesDto) {
    const cacheKey = `quizzes:list:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    
    const result = await this.prisma.quiz.findMany(...);
    await this.cache.set(cacheKey, result, 3600); // 1 hour
    return result;
  }
  ```
- [ ] Update `QuestionsService` to cache questions
- [ ] Update `LeaderboardService` to cache rankings
- [ ] Create `CacheInterceptor` for automatic caching
- [ ] Create cache invalidation hooks (on mutations)
- [ ] Add Redis health check endpoint
- [ ] Add cache statistics endpoint

**Files Created:**
```
backend/src/cache/
├── cache.module.ts
├── cache.service.ts
├── cache.interceptor.ts
└── cache.config.ts
```

**Testing:**
```bash
# Test Redis connection
npm run test:e2e cache.spec.ts

# Load test with cache
k6 run load-tests/with-cache.js
```

---

#### Task 1.2: BullMQ Integration (3 days)

**Subtasks:**
- [ ] Install dependencies: `bullmq`, `@nestjs/bull`
- [ ] Create `QueueModule` with BullMQ configuration
- [ ] Create queue processors:
  - `QuizProcessorService` (Word file parsing)
  - `AnalyticsProcessorService` (heavy calculations)
- [ ] Update `QuizzesService.importFromWord()`:
  ```typescript
  async importFromWord(file: Express.Multer.File, user: User) {
    // Add job to queue instead of processing inline
    const job = await this.quizQueue.add('parse-word', {
      fileName: file.originalname,
      buffer: file.buffer,
      userId: user.id
    }, {
      attempts: 3,
      backoff: 2000
    });
    
    return { jobId: job.id, status: 'processing' };
  }
  ```
- [ ] Create job status endpoint: `GET /api/jobs/:jobId`
- [ ] Create job dashboard for admins
- [ ] Add job completion webhooks/events
- [ ] Implement retry logic with exponential backoff
- [ ] Add job failure notifications
- [ ] Create scheduled jobs (leaderboard calculation)

**Files Created:**
```
backend/src/queue/
├── queue.module.ts
├── processors/
│   ├── quiz-processor.service.ts
│   └── analytics-processor.service.ts
├── jobs.controller.ts
└── bull.config.ts
```

**Testing:**
```typescript
// Test job processing
it('should queue Word file for processing', async () => {
  const result = await service.importFromWord(mockFile, mockUser);
  expect(result.jobId).toBeDefined();
  expect(result.status).toBe('processing');
  
  // Wait for job completion
  await waitForJob(result.jobId);
  
  // Verify quiz created
  const quiz = await prisma.quiz.findFirst({...});
  expect(quiz).toBeDefined();
});
```

---

#### Task 1.3: Rate Limiting (2 days)

**Subtasks:**
- [ ] Install dependencies: `@nestjs/throttler`
- [ ] Configure ThrottlerModule with Redis storage
- [ ] Create custom rate limit decorators:
  ```typescript
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login() {}
  ```
- [ ] Apply different limits per endpoint (see Feature 3)
- [ ] Add rate limit bypass for admins
- [ ] Create rate limit exceeded response format
- [ ] Add rate limit headers to responses
- [ ] Create rate limit monitoring endpoint
- [ ] Log rate limit violations

**Files Modified:**
```
backend/src/
├── app.module.ts (add ThrottlerModule)
├── auth/auth.controller.ts (add @Throttle)
└── common/
    ├── throttle-config.ts
    └── guards/throttler-behind-proxy.guard.ts
```

---

#### Task 1.4: Structured Logging (3 days)

**Subtasks:**
- [ ] Install dependencies: `winston`, `winston-daily-rotate-file`, `nest-winston`
- [ ] Create Winston configuration:
  ```typescript
  // logger.config.ts
  {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),
      new DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d'
      })
    ]
  }
  ```
- [ ] Create LoggerService wrapper
- [ ] Create HTTP logging middleware:
  ```typescript
  logger.http('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id,
    userAgent: req.get('user-agent')
  });
  ```
- [ ] Create exception filter with logging
- [ ] Add correlation IDs (request tracing)
- [ ] Replace all `console.log` with `logger.*`
- [ ] Add context to error logs (user, endpoint, params)
- [ ] Create log search utility (if using file storage)

**Files Created:**
```
backend/src/logger/
├── logger.module.ts
├── logger.service.ts
├── logger.config.ts
└── http-logger.middleware.ts
```

**Example Usage:**
```typescript
// Before
console.log('Quiz created', quizId);

// After
this.logger.info('Quiz created', {
  quizId,
  userId,
  title: quiz.title,
  questionCount: quiz.totalQuestions
});
```

---

#### Task 1.5: APM Integration (2 days)

**Subtasks:**
- [ ] Choose APM provider (New Relic recommended)
- [ ] Sign up and get API key
- [ ] Install APM agent: `npm install newrelic`
- [ ] Create `newrelic.js` configuration file
- [ ] Import at top of `main.ts`: `require('newrelic')`
- [ ] Configure custom instrumentation:
  ```typescript
  newrelic.recordMetric('Custom/QuizCompletion', 1);
  newrelic.addCustomAttribute('userId', user.id);
  ```
- [ ] Add custom transactions for background jobs
- [ ] Configure error tracking
- [ ] Set up alert policies in APM dashboard
- [ ] Create team dashboard with key metrics
- [ ] Document how to access and use APM

**Configuration:**
```javascript
// newrelic.js
exports.config = {
  app_name: ['QuizMaster Production'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 0.5  // 500ms
  },
  slow_sql: {
    enabled: true
  }
};
```

---

#### Task 1.6: Auto-save Progress Endpoint (2 days)

**Subtasks:**
- [ ] Create new DTO: `UpdateProgressDto`
  ```typescript
  export class UpdateProgressDto {
    @IsInt()
    currentQuestionIndex: number;
    
    @IsArray()
    answers: SavedAnswer[];
    
    @IsInt()
    timeSpent: number;
  }
  ```
- [ ] Add endpoint to `AttemptsController`:
  ```typescript
  @Patch(':id/progress')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Param('id') attemptId: string,
    @Body() dto: UpdateProgressDto,
    @User() user: UserEntity
  ) {
    return this.attemptsService.updateProgress(attemptId, dto, user.id);
  }
  ```
- [ ] Implement `AttemptsService.updateProgress()`
- [ ] Add throttling (max 1 save per 10 seconds)
- [ ] Return lightweight response (just 200 OK)
- [ ] Add to Swagger documentation

**Database (no schema change needed):**
```prisma
// quiz_attempts already has needed fields:
- startedAt
- pausedAt
- resumedAt
- timeSpent
```

---

### Frontend Tasks (React)

#### Task 1.7: Auto-save Hook (2 days)

**Subtasks:**
- [ ] Create `useAutoSave` hook (see Feature 6)
- [ ] Integrate into `QuizRunner` component
- [ ] Add save status indicator UI
- [ ] Implement LocalStorage backup
- [ ] Create recovery dialog component
- [ ] Add "Saved" animation/toast
- [ ] Handle network errors gracefully
- [ ] Test across browsers (Chrome, Firefox, Safari, Edge)

**Files Created:**
```
frontend/src/
├── hooks/useAutoSave.ts
├── components/SaveIndicator.tsx
└── components/RecoveryDialog.tsx
```

---

### DevOps Tasks

#### Task 1.8: Docker Compose Updates (1 day)

**Subtasks:**
- [ ] Add Redis service to `docker-compose.yml`:
  ```yaml
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
  ```
- [ ] Add Redis volume to volumes section
- [ ] Update backend service to depend on Redis
- [ ] Add Redis connection env vars
- [ ] Update `.env.example` with new variables
- [ ] Test full stack with Redis

---

#### Task 1.9: Nginx Caching (1 day)

**Subtasks:**
- [ ] Update `nginx.conf` with caching directives:
  ```nginx
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;
  
  location /api/quizzes {
    proxy_cache api_cache;
    proxy_cache_valid 200 1h;
    proxy_cache_key "$request_uri";
    add_header X-Cache-Status $upstream_cache_status;
  }
  ```
- [ ] Configure cache bypass for authenticated requests
- [ ] Add cache purge endpoint (for admin)
- [ ] Test cache behavior
- [ ] Monitor cache hit rate

---

## 💾 DATABASE CHANGES

### No Schema Changes Required

This phase does not require Prisma schema changes. All data structures already exist in v2.0.

**Optional (for monitoring):**
```prisma
// If you want to track job history in DB instead of Redis
model JobHistory {
  id          String   @id @default(uuid())
  jobId       String   @unique
  type        String   // 'parse-word', 'bulk-import'
  status      String   // 'pending', 'processing', 'completed', 'failed'
  startedAt   DateTime @default(now())
  completedAt DateTime?
  error       String?  // JSON error details
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## ✅ ACCEPTANCE CRITERIA

### Performance Criteria

- [ ] **API Response Time**
  - p50 < 50ms (was ~100ms)
  - p95 < 100ms (was ~200ms)
  - p99 < 200ms (was ~500ms)

- [ ] **Cache Hit Rate**
  - Overall: > 80%
  - Quiz list: > 90%
  - Quiz details: > 85%
  - Leaderboard: > 95%

- [ ] **Background Jobs**
  - Word file upload returns in < 200ms (async)
  - File processing completes in < 30s
  - Zero blocking of API endpoints

- [ ] **Rate Limiting**
  - Login brute force blocked after 5 attempts
  - File upload limited to 10/hour
  - API calls limited to 100/minute
  - Rate limit headers present in all responses

### Operational Criteria

- [ ] **Logging**
  - All errors logged with full context
  - Logs searchable by userId, endpoint, timestamp
  - Structured JSON format
  - 7-day retention

- [ ] **Monitoring**
  - APM dashboard shows real-time metrics
  - Alerts configured for critical thresholds
  - Slow queries identified automatically
  - Error rate tracked per endpoint

- [ ] **Auto-save**
  - Progress saved every 30 seconds
  - Recovery prompt appears on crash
  - LocalStorage backup functional
  - Works on mobile browsers

### Stability Criteria

- [ ] **Zero Downtime**
  - Deployment without downtime
  - Redis failover handled gracefully
  - Queue jobs survive restart

- [ ] **Load Testing**
  - System stable with 50 concurrent users
  - No memory leaks over 24 hours
  - Database connections properly pooled

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Redis Integration Breaks Existing Functionality

**Probability:** Medium  
**Impact:** High

**Mitigation:**
- [ ] Implement feature flag for caching
- [ ] Test all endpoints with cache enabled/disabled
- [ ] Gradual rollout (10% → 50% → 100% traffic)
- [ ] Monitor error rates closely during rollout
- [ ] Prepare rollback script

**Rollback Plan:**
```bash
# Disable caching via environment variable
docker-compose exec backend \
  sh -c 'echo "CACHE_ENABLED=false" >> .env && pm2 restart all'
```

---

### Risk 2: BullMQ Job Failures

**Probability:** Medium  
**Impact:** Medium

**Mitigation:**
- [ ] Implement retry logic (3 attempts with exponential backoff)
- [ ] Create job failure notifications (log + alert)
- [ ] Manual retry UI in admin panel
- [ ] Store failed job details for debugging
- [ ] Test with intentionally failing jobs

**Recovery:**
```typescript
// Manual retry endpoint
@Post('jobs/:id/retry')
@Roles('ADMIN')
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
- [ ] Start with generous limits
- [ ] Monitor rate limit hit rate
- [ ] Provide clear error messages
- [ ] Add admin bypass capability
- [ ] Make limits configurable via env vars

**Adjustment Strategy:**
```typescript
// Make limits configurable
const RATE_LIMITS = {
  login: Number(process.env.RATE_LIMIT_LOGIN) || 5,
  api: Number(process.env.RATE_LIMIT_API) || 100,
  upload: Number(process.env.RATE_LIMIT_UPLOAD) || 10
};
```

---

### Risk 4: APM Overhead Impact

**Probability:** Low  
**Impact:** Medium

**Mitigation:**
- [ ] Configure sampling rate (e.g., 10% of requests)
- [ ] Disable APM in development
- [ ] Monitor APM agent resource usage
- [ ] Use async reporting (non-blocking)

---

### Risk 5: Auto-save Conflicts

**Probability:** Low  
**Impact:** Low

**Mitigation:**
- [ ] Use optimistic locking (version field)
- [ ] Throttle save requests (max 1 per 10s)
- [ ] Handle concurrent saves gracefully
- [ ] Clear conflict resolution UX

---

## 📅 TIMELINE

### Week 1: Core Infrastructure

**Days 1-2: Redis Caching**
- Set up Redis service
- Implement CacheService
- Cache quiz list & details
- Test cache invalidation

**Days 3-4: BullMQ Queue**
- Set up BullMQ
- Move Word parsing to queue
- Create job status endpoint
- Test async flow

**Day 5: Rate Limiting**
- Configure Throttler module
- Apply limits to endpoints
- Test rate limit enforcement
- Add rate limit headers

---

### Week 2: Observability

**Days 1-2: Structured Logging**
- Configure Winston
- Create LoggerService
- Replace console.log calls
- Add HTTP request logging

**Days 3-4: APM Integration**
- Set up New Relic account
- Install APM agent
- Configure custom metrics
- Create dashboards

**Day 5: Testing & Refinement**
- Test all new integrations
- Fix any issues found
- Optimize cache keys
- Tune rate limits

---

### Week 3: User Features & Polish

**Days 1-2: Auto-save Hook**
- Create useAutoSave hook
- Integrate into QuizRunner
- Add save indicator UI
- Test recovery flow

**Days 3-4: Performance Optimization**
- Analyze APM data
- Optimize slow queries
- Fine-tune cache TTLs
- Add missing indexes

**Day 5: Load Testing**
- Run k6 load tests
- Identify bottlenecks
- Optimize further
- Document performance

---

### Week 4: Documentation & Handoff

**Days 1-2: Documentation**
- Update README
- Create monitoring guide
- Document rate limits
- Write troubleshooting guide

**Days 3-4: Testing & QA**
- Full regression testing
- Security audit
- Performance verification
- Bug fixes

**Day 5: Deployment & Monitoring**
- Deploy to production
- Monitor for 48 hours
- Address any issues
- Retrospective meeting

---

## 📦 DELIVERABLES

### Code Deliverables

```
backend/
├── src/
│   ├── cache/
│   │   ├── cache.module.ts
│   │   ├── cache.service.ts
│   │   ├── cache.interceptor.ts
│   │   └── cache.config.ts
│   ├── queue/
│   │   ├── queue.module.ts
│   │   ├── processors/
│   │   │   ├── quiz-processor.service.ts
│   │   │   └── analytics-processor.service.ts
│   │   ├── jobs.controller.ts
│   │   └── bull.config.ts
│   ├── logger/
│   │   ├── logger.module.ts
│   │   ├── logger.service.ts
│   │   ├── logger.config.ts
│   │   └── http-logger.middleware.ts
│   ├── common/
│   │   ├── throttle-config.ts
│   │   └── guards/
│   │       └── throttler-behind-proxy.guard.ts
│   └── newrelic.js
├── docker-compose.yml (updated)
└── .env.example (updated)

frontend/
├── src/
│   ├── hooks/
│   │   └── useAutoSave.ts
│   ├── components/
│   │   ├── SaveIndicator.tsx
│   │   └── RecoveryDialog.tsx
│   └── services/
│       └── autoSaveService.ts
```

---

### Documentation Deliverables

- [ ] **Redis Setup Guide** (`docs/redis-setup.md`)
  - Installation steps
  - Configuration options
  - Cache key conventions
  - Invalidation strategies

- [ ] **Queue Management Guide** (`docs/queue-management.md`)
  - Job types and priorities
  - Monitoring job status
  - Handling failures
  - Retry strategies

- [ ] **Monitoring Guide** (`docs/monitoring-guide.md`)
  - APM dashboard tour
  - Key metrics explained
  - Alert configuration
  - Troubleshooting tips

- [ ] **Performance Report** (`docs/phase1-performance-report.md`)
  - Before/after metrics
  - Load test results
  - Optimization recommendations
  - Next steps

---

### Testing Deliverables

- [ ] **Load Tests** (`tests/load/`)
  - `baseline.js` - v2.0 performance
  - `with-cache.js` - v2.1 performance
  - `stress-test.js` - Maximum capacity

- [ ] **Integration Tests** (`tests/integration/`)
  - `cache.spec.ts` - Caching behavior
  - `queue.spec.ts` - Background jobs
  - `rate-limit.spec.ts` - Rate limiting
  - `auto-save.spec.ts` - Progress saving

---

### Deployment Deliverables

- [ ] **Deployment Checklist** (`docs/phase1-deployment.md`)
  - Pre-deployment tasks
  - Deployment steps
  - Post-deployment verification
  - Rollback procedure

- [ ] **Environment Variables** (`.env.example` updates)
  ```bash
  # Redis
  REDIS_HOST=redis
  REDIS_PORT=6379
  REDIS_PASSWORD=
  CACHE_ENABLED=true
  CACHE_TTL=3600
  
  # BullMQ
  BULL_REDIS_HOST=redis
  BULL_REDIS_PORT=6379
  
  # Rate Limiting
  RATE_LIMIT_ENABLED=true
  RATE_LIMIT_LOGIN=5
  RATE_LIMIT_API=100
  
  # Logging
  LOG_LEVEL=info
  LOG_FILE_ENABLED=true
  
  # APM
  NEW_RELIC_LICENSE_KEY=your-key-here
  NEW_RELIC_APP_NAME=QuizMaster
  ```

---

## 🎯 SUCCESS METRICS

### Key Performance Indicators (KPIs)

| Metric | Before (v2.0) | Target (v2.1) | Method |
|--------|--------------|---------------|--------|
| API Response (p95) | 200ms | < 100ms | APM |
| Cache Hit Rate | 0% | > 80% | Redis INFO |
| Database Load | High | -60% | DB monitoring |
| Upload Time (user-facing) | 10-30s | < 200ms | APM |
| Failed Requests | 2% | < 0.5% | APM |
| System Uptime | 99% | 99.9% | APM |
| Concurrent Users | 20 | 50+ | Load test |

---

## 🏁 DEFINITION OF DONE

Phase 1 is considered **COMPLETE** when:

- [ ] All technical tasks checked off
- [ ] All acceptance criteria met
- [ ] Load tests passing (50 concurrent users)
- [ ] Zero critical bugs in production
- [ ] Documentation complete and reviewed
- [ ] Team trained on new tools (Redis, APM)
- [ ] Monitoring dashboards operational
- [ ] Stakeholder demo completed
- [ ] Performance report published
- [ ] Retrospective meeting held

---

**Prepared by:** Development Team  
**Approved by:** Tech Lead  
**Start Date:** TBD  
**Target Completion:** TBD + 3-4 weeks  
**Status:** Ready to Start 🟢
