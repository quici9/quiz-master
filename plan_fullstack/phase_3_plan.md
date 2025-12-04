# 🔧 PHASE 3: PROFESSIONAL ADMIN TOOLS

**Duration:** 3-4 weeks  
**Priority:** 🔴 HIGH  
**Team Size:** 2-3 Full-stack developers  
**Status:** Depends on Phase 1

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

Phase 3 empowers admins with **professional-grade content management tools** that save time, prevent errors, and provide deep insights. This phase focuses on making admin operations **60% more efficient** through preview, versioning, bulk operations, and advanced analytics.

**Key Focus Areas:**
- 📝 Content preview before publish
- 🔄 Quiz versioning & rollback
- 📦 Bulk operations (upload, edit, delete)
- 🔍 Advanced search & filtering
- 👥 User management dashboard
- 📊 Quiz analytics for admins
- 💾 Automated backup system

---

## 🎯 OBJECTIVE

**Primary Goal:**  
Reduce admin operational overhead by **60%** while increasing content quality and providing actionable insights.

**Specific Objectives:**
1. Reduce quiz creation time from 15 minutes to 5 minutes
2. Eliminate 90% of content publishing errors
3. Enable rollback of bad quiz versions in <1 minute
4. Process bulk uploads 10x faster than manual
5. Provide admin with full user performance visibility

---

## 🤔 WHY THIS PHASE

### Current Admin Pain Points

**No Preview Capability:**
- ❌ Admins publish quizzes blindly
- ❌ Errors only found after users complain
- ❌ No way to test quiz before going live
- ❌ Formatting issues discovered too late

**No Version Control:**
- ❌ Cannot rollback bad edits
- ❌ No audit trail of changes
- ❌ Lost previous versions permanently
- ❌ No comparison between versions

**Manual, Time-Consuming Operations:**
- ❌ Upload one file at a time (10-15 mins each)
- ❌ Edit quizzes one by one
- ❌ No bulk category assignment
- ❌ Search is basic (title only)

**Limited User Management:**
- ❌ Cannot see user details
- ❌ No password reset capability
- ❌ No activity tracking
- ❌ Cannot identify problematic users

**No Operational Insights:**
- ❌ Don't know which quizzes are popular
- ❌ Cannot identify difficult questions
- ❌ No completion rate data
- ❌ Missing user engagement metrics

**Manual Backups:**
- ❌ Rely on admin to remember
- ❌ No automatic schedule
- ❌ No backup verification
- ❌ Risk of data loss

### Business Impact

**Without This Phase:**
- ❌ Admins spend 80% time on manual tasks
- ❌ High error rate frustrates users
- ❌ Cannot scale content creation
- ❌ No data-driven decisions
- ❌ Risk of catastrophic data loss

**With This Phase:**
- ✅ Admins focus on content quality
- ✅ Errors caught before publish
- ✅ 10x faster content operations
- ✅ Data-driven content improvements
- ✅ Zero data loss risk

---

## 📦 SCOPE

### ✅ In Scope

**Content Management:**
- Quiz preview (test mode for admins)
- Quiz versioning (full history + rollback)
- Bulk upload (multiple Word files)
- Bulk edit (category, difficulty, status)
- Advanced search (full-text, filters)
- Quiz duplication (clone + modify)

**User Management:**
- User dashboard (list, search, filter)
- User detail page (stats, history, activity)
- Password reset by admin
- Account suspension
- Activity tracking

**Analytics:**
- Quiz analytics dashboard
- Completion rates
- Average scores by quiz
- Question difficulty analysis
- User engagement metrics

**Operations:**
- Automated daily backups
- Backup verification
- One-click restore
- System health monitoring
- Audit logs

### ❌ Out of Scope

- Advanced RBAC (Phase 5)
- Question bank (Phase 5)
- AI features (Phase 5)
- Email notifications (Phase 4)
- Real-time monitoring (Phase 5)

---

## 👥 USER STORIES

### As an **Admin**

**US-3.1: Preview Before Publish**
```
As an admin uploading a new quiz,
I want to preview it exactly as users will see it,
So that I can catch errors before publishing.

Acceptance:
- "Preview" button after Word upload
- Opens quiz in test mode
- Can take quiz as if a student
- Shows formatting, questions, options
- Can edit and re-preview
- Publish only when satisfied
```

**US-3.2: Quiz Versioning**
```
As an admin who made a mistake,
I want to rollback to a previous quiz version,
So that I can quickly fix issues without re-uploading.

Acceptance:
- See full version history
- Compare two versions (diff view)
- One-click rollback
- Version notes/comments
- Audit trail of who changed what
```

**US-3.3: Bulk Upload**
```
As an admin with 50 quiz files,
I want to upload them all at once,
So that I don't waste hours on repetitive uploads.

Acceptance:
- Select multiple .docx files
- Shows progress for each file
- Continue uploading despite individual failures
- Summary report (X succeeded, Y failed)
- Can bulk assign category
```

**US-3.4: Advanced Search**
```
As an admin looking for specific content,
I want to search quizzes by keywords, category, and difficulty,
So that I can find what I need quickly.

Acceptance:
- Full-text search (title + description)
- Filter by category
- Filter by difficulty
- Filter by status (draft/published)
- Sort by date, title, popularity
- Results update instantly
```

**US-3.5: User Management**
```
As an admin managing users,
I want a dashboard showing all users with their activity,
So that I can identify and help struggling students.

Acceptance:
- List all users with stats
- Search by name or email
- Filter by activity level
- Click user to see detailed stats
- Reset password
- Suspend account
```

**US-3.6: Quiz Analytics**
```
As an admin evaluating content quality,
I want to see which quizzes are performing well,
So that I can improve or remove poor quizzes.

Acceptance:
- Completion rate per quiz
- Average score per quiz
- Most/least popular quizzes
- Question-level difficulty
- Identify broken questions
```

**US-3.7: Automated Backups**
```
As an admin responsible for data safety,
I want automatic daily backups with verification,
So that I can restore data if something goes wrong.

Acceptance:
- Backups run automatically at 2 AM
- Backup success/failure notifications
- List of available backups
- One-click restore
- Backup size and date shown
```

---

## 🎨 FEATURE BREAKDOWN

### Feature 1: Preview Before Publish

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 4 days

**Description:**  
Allow admins to test quizzes in a sandbox environment before making them public.

**Implementation:**

**Backend:**
```typescript
// QuizzesService
async previewQuiz(quizId: string, adminId: string) {
  const quiz = await this.prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: { options: true },
        orderBy: { order: 'asc' }
      }
    }
  });
  
  // Create temporary "preview attempt" (not saved to stats)
  const previewAttempt = {
    ...quiz,
    isPreview: true,
    attemptId: `preview-${Date.now()}`
  };
  
  return previewAttempt;
}

// Endpoint: GET /api/admin/quizzes/:id/preview
// Endpoint: POST /api/admin/quizzes/:id/publish (after preview)
```

**Frontend:**
```tsx
// pages/admin/QuizPreview.tsx
<div className="preview-mode-banner bg-yellow-100 p-2">
  ⚠️ PREVIEW MODE - This quiz is not published yet
</div>

<QuizRunner 
  quiz={previewQuiz}
  isPreview={true}
  onComplete={handlePreviewComplete}
/>

<div className="preview-actions mt-4 flex gap-2">
  <button onClick={goBackToEdit}>
    Edit Quiz
  </button>
  <button onClick={publishQuiz} className="btn-primary">
    Publish Quiz
  </button>
</div>
```

**UI Flow:**
```
1. Admin uploads Word file
2. Quiz created in "DRAFT" status
3. Redirect to preview page
4. Admin takes quiz as test
5. If satisfied → Click "Publish"
6. If not → Click "Edit" → Re-upload or modify
```

---

### Feature 2: Quiz Versioning

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐⭐ Very High  
**Effort:** 5 days

**Description:**  
Track all changes to quizzes and allow rollback to previous versions.

**Database Schema:**

```prisma
model QuizVersion {
  id          String   @id @default(uuid())
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  version     Int      // 1, 2, 3...
  title       String
  description String?
  difficulty  QuestionDifficulty
  timeLimit   Int?
  
  // Snapshot of questions (JSON)
  questionsSnapshot Json  // Full quiz structure
  
  // Metadata
  createdBy   String
  createdAt   DateTime @default(now())
  changeNote  String?  // "Fixed typo in question 3"
  
  // Status
  isActive    Boolean @default(false)  // Only one active version
  
  @@index([quizId, version])
  @@unique([quizId, version])
}

model AuditLog {
  id          String   @id @default(uuid())
  action      String   // 'quiz.create', 'quiz.update', 'quiz.delete'
  entityType  String   // 'quiz', 'user', 'category'
  entityId    String
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  changes     Json?    // Before/after diff
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  
  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

**Backend Service:**

```typescript
// VersioningService
@Injectable()
export class VersioningService {
  async createVersion(quizId: string, userId: string, note?: string) {
    // Get current quiz state
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });
    
    // Get next version number
    const lastVersion = await this.prisma.quizVersion.findFirst({
      where: { quizId },
      orderBy: { version: 'desc' }
    });
    const nextVersion = (lastVersion?.version || 0) + 1;
    
    // Create version snapshot
    await this.prisma.quizVersion.create({
      data: {
        quizId,
        version: nextVersion,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        questionsSnapshot: quiz.questions,  // Full JSON snapshot
        createdBy: userId,
        changeNote: note,
        isActive: true
      }
    });
    
    // Deactivate previous versions
    await this.prisma.quizVersion.updateMany({
      where: {
        quizId,
        version: { lt: nextVersion }
      },
      data: { isActive: false }
    });
  }
  
  async getVersionHistory(quizId: string) {
    return this.prisma.quizVersion.findMany({
      where: { quizId },
      orderBy: { version: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } }
      }
    });
  }
  
  async rollback(quizId: string, targetVersion: number, userId: string) {
    // Get target version
    const version = await this.prisma.quizVersion.findUnique({
      where: {
        quizId_version: { quizId, version: targetVersion }
      }
    });
    
    if (!version) throw new NotFoundException();
    
    // Start transaction
    return this.prisma.$transaction(async (tx) => {
      // Delete current questions
      await tx.question.deleteMany({ where: { quizId } });
      
      // Restore quiz metadata
      await tx.quiz.update({
        where: { id: quizId },
        data: {
          title: version.title,
          description: version.description,
          difficulty: version.difficulty,
          timeLimit: version.timeLimit
        }
      });
      
      // Restore questions from snapshot
      const questions = version.questionsSnapshot as any[];
      for (const q of questions) {
        await tx.question.create({
          data: {
            quizId,
            text: q.text,
            order: q.order,
            difficulty: q.difficulty,
            explanation: q.explanation,
            options: {
              create: q.options.map(opt => ({
                label: opt.label,
                text: opt.text,
                isCorrect: opt.isCorrect
              }))
            }
          }
        });
      }
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          action: 'quiz.rollback',
          entityType: 'quiz',
          entityId: quizId,
          userId,
          changes: {
            from: 'current',
            to: targetVersion,
            note: `Rolled back to version ${targetVersion}`
          }
        }
      });
    });
  }
  
  async compareVersions(quizId: string, v1: number, v2: number) {
    const version1 = await this.getVersion(quizId, v1);
    const version2 = await this.getVersion(quizId, v2);
    
    // Generate diff
    return {
      titleChanged: version1.title !== version2.title,
      questionsAdded: this.countNewQuestions(v1, v2),
      questionsRemoved: this.countRemovedQuestions(v1, v2),
      questionsModified: this.countModifiedQuestions(v1, v2),
      diff: this.generateDiff(version1, version2)
    };
  }
}
```

**Frontend Components:**

```tsx
// pages/admin/QuizVersionHistory.tsx
<div className="version-history">
  <h2>Version History - {quiz.title}</h2>
  
  <div className="versions-list">
    {versions.map(v => (
      <div key={v.version} className="version-item">
        <div className="flex items-center justify-between">
          <div>
            <span className="version-number">v{v.version}</span>
            {v.isActive && <Badge variant="success">ACTIVE</Badge>}
            <span className="date">{formatDate(v.createdAt)}</span>
            <span className="author">{v.user.fullName}</span>
          </div>
          
          <div className="actions flex gap-2">
            <button onClick={() => viewVersion(v.version)}>
              View
            </button>
            {!v.isActive && (
              <button onClick={() => rollbackTo(v.version)}>
                Restore
              </button>
            )}
            <button onClick={() => compareWith(v.version)}>
              Compare
            </button>
          </div>
        </div>
        
        {v.changeNote && (
          <div className="change-note text-sm text-gray-600">
            {v.changeNote}
          </div>
        )}
      </div>
    ))}
  </div>
  
  {/* Comparison Modal */}
  <Modal open={comparing} onClose={() => setComparing(false)}>
    <h3>Compare Versions</h3>
    <QuizDiff version1={selectedV1} version2={selectedV2} />
  </Modal>
</div>
```

**Automatic Versioning:**
```typescript
// Trigger versioning on quiz update
@Patch(':id')
@Roles('ADMIN')
async updateQuiz(
  @Param('id') id: string,
  @Body() dto: UpdateQuizDto,
  @User() user: UserEntity
) {
  // Create version before update
  await this.versioningService.createVersion(
    id, 
    user.id, 
    dto.changeNote
  );
  
  // Then update quiz
  return this.quizzesService.update(id, dto);
}
```

---

### Feature 3: Bulk Operations

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 4 days

**Description:**  
Process multiple quizzes simultaneously for upload, edit, and delete operations.

**Backend Implementation:**

```typescript
// BulkOperationsService
@Injectable()
export class BulkOperationsService {
  async bulkUpload(
    files: Express.Multer.File[],
    options: { categoryId?: string; difficulty?: string },
    userId: string
  ) {
    const results = {
      total: files.length,
      succeeded: 0,
      failed: 0,
      details: []
    };
    
    for (const file of files) {
      try {
        // Queue each file for processing (Phase 1's BullMQ)
        const job = await this.quizQueue.add('parse-word', {
          fileName: file.originalname,
          buffer: file.buffer,
          userId,
          categoryId: options.categoryId,
          difficulty: options.difficulty
        });
        
        results.succeeded++;
        results.details.push({
          fileName: file.originalname,
          status: 'queued',
          jobId: job.id
        });
      } catch (error) {
        results.failed++;
        results.details.push({
          fileName: file.originalname,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return results;
  }
  
  async bulkEdit(
    quizIds: string[],
    updates: { categoryId?: string; difficulty?: string; isPublished?: boolean }
  ) {
    return this.prisma.quiz.updateMany({
      where: {
        id: { in: quizIds }
      },
      data: updates
    });
  }
  
  async bulkDelete(quizIds: string[], userId: string) {
    // Create audit logs
    await Promise.all(
      quizIds.map(id =>
        this.auditLog.create({
          action: 'quiz.delete',
          entityId: id,
          userId
        })
      )
    );
    
    // Delete quizzes (cascade to questions)
    return this.prisma.quiz.deleteMany({
      where: {
        id: { in: quizIds }
      }
    });
  }
}
```

**Frontend:**

```tsx
// pages/admin/BulkUpload.tsx
<div className="bulk-upload">
  <h2>Bulk Upload Quizzes</h2>
  
  {/* File Dropzone */}
  <Dropzone onDrop={handleDrop} multiple>
    {({ getRootProps, getInputProps }) => (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} accept=".docx" />
        <p>Drop .docx files here or click to browse</p>
        <p className="text-sm text-gray-500">
          You can upload up to 50 files at once
        </p>
      </div>
    )}
  </Dropzone>
  
  {/* File List */}
  {files.length > 0 && (
    <div className="files-list mt-4">
      <h3>{files.length} files selected</h3>
      {files.map((file, i) => (
        <div key={i} className="file-item flex justify-between">
          <span>{file.name}</span>
          <button onClick={() => removeFile(i)}>Remove</button>
        </div>
      ))}
    </div>
  )}
  
  {/* Options */}
  <div className="options mt-4">
    <Select
      label="Category (applies to all)"
      value={bulkCategory}
      onChange={setBulkCategory}
      options={categories}
    />
    <Select
      label="Difficulty"
      value={bulkDifficulty}
      onChange={setBulkDifficulty}
      options={['EASY', 'MEDIUM', 'HARD', 'EXPERT']}
    />
  </div>
  
  {/* Upload Button */}
  <button
    onClick={handleBulkUpload}
    disabled={files.length === 0 || uploading}
    className="btn-primary mt-4"
  >
    {uploading ? 'Uploading...' : `Upload ${files.length} Files`}
  </button>
  
  {/* Progress */}
  {uploading && (
    <div className="progress mt-4">
      <ProgressBar
        current={uploadProgress.completed}
        total={uploadProgress.total}
      />
      <div className="status">
        <span className="text-green-600">
          ✓ {uploadProgress.succeeded} succeeded
        </span>
        {uploadProgress.failed > 0 && (
          <span className="text-red-600">
            ✗ {uploadProgress.failed} failed
          </span>
        )}
      </div>
    </div>
  )}
  
  {/* Results */}
  {results && (
    <div className="results mt-4">
      <h3>Upload Complete</h3>
      <p>
        {results.succeeded} of {results.total} files uploaded successfully
      </p>
      {results.failed > 0 && (
        <div className="failed-files">
          <h4>Failed Files:</h4>
          {results.details
            .filter(d => d.status === 'failed')
            .map((detail, i) => (
              <div key={i} className="error-item">
                <span>{detail.fileName}</span>
                <span className="error">{detail.error}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )}
</div>

// pages/admin/ManageQuizzes.tsx (Bulk Edit/Delete)
<div className="quiz-table">
  {/* Select All Checkbox */}
  <input
    type="checkbox"
    checked={allSelected}
    onChange={toggleSelectAll}
  />
  
  {/* Quiz Rows */}
  {quizzes.map(quiz => (
    <div key={quiz.id} className="quiz-row">
      <input
        type="checkbox"
        checked={selectedIds.includes(quiz.id)}
        onChange={() => toggleSelect(quiz.id)}
      />
      <span>{quiz.title}</span>
      {/* ... other columns */}
    </div>
  ))}
  
  {/* Bulk Actions Bar */}
  {selectedIds.length > 0 && (
    <div className="bulk-actions-bar">
      <span>{selectedIds.length} selected</span>
      
      <Select
        placeholder="Bulk actions..."
        onChange={handleBulkAction}
        options={[
          { value: 'edit-category', label: 'Change Category' },
          { value: 'edit-difficulty', label: 'Change Difficulty' },
          { value: 'publish', label: 'Publish' },
          { value: 'unpublish', label: 'Unpublish' },
          { value: 'delete', label: 'Delete' }
        ]}
      />
      
      <button onClick={applyBulkAction}>Apply</button>
      <button onClick={clearSelection}>Cancel</button>
    </div>
  )}
</div>
```

---

### Feature 4: Advanced Search & Filter

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 2 days

**Description:**  
Powerful search with multiple filters for finding quizzes quickly.

**Backend:**

```typescript
// QuizzesService
async searchQuizzes(query: SearchQuizzesDto) {
  const where: Prisma.QuizWhereInput = {};
  
  // Full-text search
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } }
    ];
  }
  
  // Filters
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  
  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }
  
  if (query.isPublished !== undefined) {
    where.isPublished = query.isPublished;
  }
  
  if (query.createdBy) {
    where.createdBy = query.createdBy;
  }
  
  // Date range
  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
    if (query.dateTo) where.createdAt.lte = new Date(query.dateTo);
  }
  
  const [quizzes, total] = await Promise.all([
    this.prisma.quiz.findMany({
      where,
      skip: query.skip,
      take: query.take,
      orderBy: this.buildOrderBy(query.sortBy, query.sortOrder),
      include: {
        category: true,
        _count: {
          select: {
            attempts: true,
            questions: true
          }
        }
      }
    }),
    this.prisma.quiz.count({ where })
  ]);
  
  return { quizzes, total };
}
```

**Frontend:**

```tsx
// components/admin/QuizSearchFilter.tsx
<div className="search-filters">
  {/* Search Input */}
  <Input
    placeholder="Search quizzes..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    icon={SearchIcon}
  />
  
  {/* Filters */}
  <div className="filters flex gap-2">
    <Select
      placeholder="Category"
      value={categoryFilter}
      onChange={setCategoryFilter}
      options={categories}
    />
    
    <Select
      placeholder="Difficulty"
      value={difficultyFilter}
      onChange={setDifficultyFilter}
      options={['EASY', 'MEDIUM', 'HARD', 'EXPERT']}
    />
    
    <Select
      placeholder="Status"
      value={statusFilter}
      onChange={setStatusFilter}
      options={[
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
      ]}
    />
    
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
    />
    
    {/* Clear Filters */}
    {hasActiveFilters && (
      <button onClick={clearFilters}>Clear All</button>
    )}
  </div>
  
  {/* Sort */}
  <div className="sort flex gap-2">
    <Select
      value={sortBy}
      onChange={setSortBy}
      options={[
        { value: 'createdAt', label: 'Date Created' },
        { value: 'title', label: 'Title' },
        { value: 'attempts', label: 'Popularity' },
        { value: 'avgScore', label: 'Avg Score' }
      ]}
    />
    <button onClick={toggleSortOrder}>
      {sortOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </button>
  </div>
</div>
```

---

### Feature 5: User Management Dashboard

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 4 days

**Description:**  
Comprehensive user management with stats, search, and admin actions.

**Backend:**

```typescript
// UsersService (Admin Methods)
async findAllUsers(query: FindAllUsersDto) {
  const where: Prisma.UserWhereInput = {};
  
  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } }
    ];
  }
  
  if (query.role) {
    where.role = query.role;
  }
  
  // Activity filter
  if (query.activity === 'active') {
    where.lastActiveAt = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  } else if (query.activity === 'inactive') {
    where.lastActiveAt = { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  }
  
  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      skip: query.skip,
      take: query.take,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            quizAttempts: true,
            bookmarks: true
          }
        }
      }
    }),
    this.prisma.user.count({ where })
  ]);
  
  // Enrich with stats
  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const stats = await this.getUserStats(user.id);
      return { ...user, stats };
    })
  );
  
  return { users: enrichedUsers, total };
}

async getUserStats(userId: string) {
  const [
    totalAttempts,
    completedAttempts,
    avgScore,
    totalTimeSpent
  ] = await Promise.all([
    this.prisma.quizAttempt.count({ where: { userId } }),
    this.prisma.quizAttempt.count({
      where: { userId, status: 'COMPLETED' }
    }),
    this.prisma.quizAttempt.aggregate({
      where: { userId, status: 'COMPLETED' },
      _avg: { score: true }
    }),
    this.prisma.quizAttempt.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { timeSpent: true }
    })
  ]);
  
  return {
    totalAttempts,
    completedAttempts,
    completionRate: totalAttempts > 0
      ? Math.round((completedAttempts / totalAttempts) * 100)
      : 0,
    avgScore: Math.round(avgScore._avg.score || 0),
    totalTimeSpent: totalTimeSpent._sum.timeSpent || 0
  };
}

async resetUserPassword(userId: string, newPassword: string, adminId: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await this.prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
  
  // Audit log
  await this.auditLog.create({
    action: 'user.password_reset',
    entityId: userId,
    userId: adminId
  });
  
  // TODO: Send email to user
}

async suspendUser(userId: string, reason: string, adminId: string) {
  await this.prisma.user.update({
    where: { id: userId },
    data: {
      isSuspended: true,
      suspensionReason: reason,
      suspendedAt: new Date(),
      suspendedBy: adminId
    }
  });
  
  // Audit log
  await this.auditLog.create({
    action: 'user.suspend',
    entityId: userId,
    userId: adminId,
    changes: { reason }
  });
}
```

**Frontend:**

```tsx
// pages/admin/UserManagement.tsx
<div className="user-management">
  <div className="header flex justify-between">
    <h1>User Management</h1>
    <div className="stats flex gap-4">
      <StatCard title="Total Users" value={totalUsers} />
      <StatCard title="Active Today" value={activeToday} />
      <StatCard title="New This Week" value={newThisWeek} />
    </div>
  </div>
  
  {/* Search & Filters */}
  <div className="search-bar flex gap-2">
    <Input
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Select
      placeholder="Role"
      value={roleFilter}
      onChange={setRoleFilter}
      options={['All', 'USER', 'ADMIN']}
    />
    <Select
      placeholder="Activity"
      value={activityFilter}
      onChange={setActivityFilter}
      options={['All', 'Active', 'Inactive']}
    />
  </div>
  
  {/* Users Table */}
  <table className="users-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Joined</th>
        <th>Last Active</th>
        <th>Attempts</th>
        <th>Avg Score</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.fullName}</td>
          <td>{user.email}</td>
          <td><Badge>{user.role}</Badge></td>
          <td>{formatDate(user.createdAt)}</td>
          <td>{formatTimeAgo(user.lastActiveAt)}</td>
          <td>{user.stats.totalAttempts}</td>
          <td>{user.stats.avgScore}%</td>
          <td>
            <DropdownMenu>
              <MenuItem onClick={() => viewUser(user.id)}>
                View Details
              </MenuItem>
              <MenuItem onClick={() => resetPassword(user.id)}>
                Reset Password
              </MenuItem>
              <MenuItem onClick={() => suspendUser(user.id)} danger>
                Suspend Account
              </MenuItem>
            </DropdownMenu>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  
  {/* Pagination */}
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</div>

// pages/admin/UserDetail.tsx
<div className="user-detail">
  <div className="user-header">
    <Avatar user={user} size="large" />
    <div>
      <h2>{user.fullName}</h2>
      <p>{user.email}</p>
      <Badge>{user.role}</Badge>
      {user.isSuspended && <Badge variant="danger">SUSPENDED</Badge>}
    </div>
  </div>
  
  {/* Stats Overview */}
  <div className="stats-grid grid grid-cols-4 gap-4">
    <StatCard title="Total Attempts" value={stats.totalAttempts} />
    <StatCard title="Completed" value={stats.completedAttempts} />
    <StatCard title="Average Score" value={`${stats.avgScore}%`} />
    <StatCard title="Time Spent" value={formatDuration(stats.totalTimeSpent)} />
  </div>
  
  {/* Recent Activity */}
  <div className="recent-activity mt-8">
    <h3>Recent Quiz Attempts</h3>
    <table>
      <thead>
        <tr>
          <th>Quiz</th>
          <th>Score</th>
          <th>Date</th>
          <th>Time Spent</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {recentAttempts.map(attempt => (
          <tr key={attempt.id}>
            <td>{attempt.quiz.title}</td>
            <td>{attempt.score}/{attempt.totalQuestions}</td>
            <td>{formatDate(attempt.completedAt)}</td>
            <td>{formatDuration(attempt.timeSpent)}</td>
            <td><Badge>{attempt.status}</Badge></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Performance Charts */}
  <div className="charts mt-8">
    <h3>Performance Over Time</h3>
    <ScoreTrendChart userId={user.id} />
  </div>
</div>
```

---

### Feature 6: Quiz Analytics Dashboard

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 3 days

**Description:**  
Admin dashboard showing quiz performance metrics and insights.

**Backend:**

```typescript
// AnalyticsService (Admin Methods)
async getQuizAnalytics(quizId: string) {
  const [
    quiz,
    totalAttempts,
    completedAttempts,
    avgScore,
    avgTimeSpent,
    questionStats
  ] = await Promise.all([
    this.prisma.quiz.findUnique({ where: { id: quizId } }),
    this.prisma.quizAttempt.count({ where: { quizId } }),
    this.prisma.quizAttempt.count({
      where: { quizId, status: 'COMPLETED' }
    }),
    this.prisma.quizAttempt.aggregate({
      where: { quizId, status: 'COMPLETED' },
      _avg: { score: true }
    }),
    this.prisma.quizAttempt.aggregate({
      where: { quizId, status: 'COMPLETED' },
      _avg: { timeSpent: true }
    }),
    this.getQuestionDifficultyStats(quizId)
  ]);
  
  const completionRate = totalAttempts > 0
    ? (completedAttempts / totalAttempts) * 100
    : 0;
  
  return {
    quiz,
    totalAttempts,
    completedAttempts,
    completionRate: Math.round(completionRate),
    avgScore: Math.round(avgScore._avg.score || 0),
    avgTimeSpent: Math.round(avgTimeSpent._avg.timeSpent || 0),
    questionStats
  };
}

async getQuestionDifficultyStats(quizId: string) {
  // Get accuracy per question
  const questions = await this.prisma.question.findMany({
    where: { quizId },
    include: {
      _count: {
        select: {
          answers: true
        }
      }
    }
  });
  
  const stats = await Promise.all(
    questions.map(async (q) => {
      const correctCount = await this.prisma.attemptAnswer.count({
        where: {
          questionId: q.id,
          isCorrect: true
        }
      });
      
      const totalCount = q._count.answers;
      const accuracy = totalCount > 0
        ? (correctCount / totalCount) * 100
        : 0;
      
      return {
        questionId: q.id,
        text: q.text,
        accuracy: Math.round(accuracy),
        totalAnswers: totalCount,
        // Classify difficulty based on actual performance
        actualDifficulty: accuracy > 80 ? 'EASY' :
                         accuracy > 60 ? 'MEDIUM' :
                         accuracy > 40 ? 'HARD' : 'EXPERT'
      };
    })
  );
  
  return stats.sort((a, b) => a.accuracy - b.accuracy);  // Hardest first
}

async getAllQuizzesOverview() {
  const quizzes = await this.prisma.quiz.findMany({
    include: {
      _count: {
        select: {
          attempts: true,
          questions: true
        }
      }
    }
  });
  
  // Enrich with stats
  const enriched = await Promise.all(
    quizzes.map(async (quiz) => {
      const completedCount = await this.prisma.quizAttempt.count({
        where: { quizId: quiz.id, status: 'COMPLETED' }
      });
      
      const avgScore = await this.prisma.quizAttempt.aggregate({
        where: { quizId: quiz.id, status: 'COMPLETED' },
        _avg: { score: true }
      });
      
      return {
        ...quiz,
        completedAttempts: completedCount,
        completionRate: quiz._count.attempts > 0
          ? Math.round((completedCount / quiz._count.attempts) * 100)
          : 0,
        avgScore: Math.round(avgScore._avg.score || 0)
      };
    })
  );
  
  return enriched;
}
```

**Frontend:**

```tsx
// pages/admin/QuizAnalytics.tsx
<div className="quiz-analytics">
  <h1>Quiz Analytics - {quiz.title}</h1>
  
  {/* Summary Cards */}
  <div className="stats-grid grid grid-cols-4 gap-4">
    <StatCard
      title="Total Attempts"
      value={analytics.totalAttempts}
      icon={UsersIcon}
    />
    <StatCard
      title="Completion Rate"
      value={`${analytics.completionRate}%`}
      icon={CheckCircleIcon}
      trend={analytics.completionRate >= 70 ? 'up' : 'down'}
    />
    <StatCard
      title="Average Score"
      value={`${analytics.avgScore}%`}
      icon={ChartIcon}
    />
    <StatCard
      title="Avg Time"
      value={formatDuration(analytics.avgTimeSpent)}
      icon={ClockIcon}
    />
  </div>
  
  {/* Insights */}
  {analytics.completionRate < 50 && (
    <Alert variant="warning">
      ⚠️ Low completion rate. Consider reducing quiz length or difficulty.
    </Alert>
  )}
  
  {analytics.avgScore < 50 && (
    <Alert variant="danger">
      ⚠️ Low average score. Quiz may be too difficult or questions unclear.
    </Alert>
  )}
  
  {/* Question Difficulty Analysis */}
  <div className="question-stats mt-8">
    <h2>Question Difficulty Analysis</h2>
    <p className="text-sm text-gray-600">
      Questions ordered by difficulty (hardest first)
    </p>
    
    <table className="w-full mt-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Accuracy</th>
          <th>Answers</th>
          <th>Difficulty</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {analytics.questionStats.map((q, i) => (
          <tr key={q.questionId}>
            <td>{i + 1}</td>
            <td className="max-w-md truncate">{q.text}</td>
            <td>
              <div className="flex items-center gap-2">
                <ProgressBar value={q.accuracy} max={100} />
                <span>{q.accuracy}%</span>
              </div>
            </td>
            <td>{q.totalAnswers}</td>
            <td>
              <Badge 
                variant={
                  q.accuracy > 80 ? 'success' :
                  q.accuracy > 60 ? 'warning' : 'danger'
                }
              >
                {q.actualDifficulty}
              </Badge>
            </td>
            <td>
              {q.accuracy < 30 && (
                <button onClick={() => reviewQuestion(q.questionId)}>
                  Review Question
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Score Distribution Chart */}
  <div className="score-distribution mt-8">
    <h2>Score Distribution</h2>
    <BarChart data={scoreDistribution}>
      <XAxis dataKey="range" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#3b82f6" />
    </BarChart>
  </div>
</div>

// pages/admin/AllQuizzesAnalytics.tsx
<div className="all-quizzes-analytics">
  <h1>All Quizzes Analytics</h1>
  
  {/* Overview Stats */}
  <div className="overview-stats grid grid-cols-4 gap-4">
    <StatCard title="Total Quizzes" value={totalQuizzes} />
    <StatCard title="Total Attempts" value={totalAttempts} />
    <StatCard title="Avg Completion Rate" value={`${avgCompletionRate}%`} />
    <StatCard title="Avg Score" value={`${avgScore}%`} />
  </div>
  
  {/* Quizzes Table */}
  <div className="mt-8">
    <div className="flex justify-between items-center mb-4">
      <h2>Quiz Performance</h2>
      <Select
        value={sortBy}
        onChange={setSortBy}
        options={[
          { value: 'popularity', label: 'Most Popular' },
          { value: 'completion', label: 'Best Completion Rate' },
          { value: 'score', label: 'Highest Score' },
          { value: 'difficulty', label: 'Most Difficult' }
        ]}
      />
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Quiz Title</th>
          <th>Category</th>
          <th>Attempts</th>
          <th>Completion</th>
          <th>Avg Score</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map(quiz => (
          <tr key={quiz.id}>
            <td>{quiz.title}</td>
            <td>{quiz.category?.name}</td>
            <td>{quiz._count.attempts}</td>
            <td>
              <div className="flex items-center gap-2">
                <ProgressBar value={quiz.completionRate} />
                <span>{quiz.completionRate}%</span>
              </div>
            </td>
            <td>{quiz.avgScore}%</td>
            <td>
              {quiz.isPublished ? (
                <Badge variant="success">Published</Badge>
              ) : (
                <Badge variant="default">Draft</Badge>
              )}
            </td>
            <td>
              <button onClick={() => viewAnalytics(quiz.id)}>
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

---

### Feature 7: Automated Backups

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 3 days

**Description:**  
Automated daily backups with verification and one-click restore.

**Implementation:**

**Docker Service:**
```yaml
# docker-compose.yml addition
backup-service:
  image: prodrigestivill/postgres-backup-local:14
  environment:
    - POSTGRES_HOST=db
    - POSTGRES_DB=quizdb
    - POSTGRES_USER=quizuser
    - POSTGRES_PASSWORD=${DB_PASSWORD}
    - SCHEDULE=0 2 * * *  # 2 AM daily
    - BACKUP_KEEP_DAYS=30
    - BACKUP_KEEP_WEEKS=8
    - BACKUP_KEEP_MONTHS=6
    - HEALTHCHECK_PORT=8080
  volumes:
    - ./backups:/backups
  depends_on:
    - db
```

**Backend Service:**
```typescript
// BackupService
@Injectable()
export class BackupService {
  async listBackups() {
    const backupDir = path.join(process.cwd(), 'backups');
    const files = await fs.readdir(backupDir);
    
    const backups = await Promise.all(
      files
        .filter(f => f.endsWith('.sql.gz'))
        .map(async (filename) => {
          const filepath = path.join(backupDir, filename);
          const stats = await fs.stat(filepath);
          
          return {
            filename,
            size: stats.size,
            createdAt: stats.mtime,
            verified: await this.verifyBackup(filepath)
          };
        })
    );
    
    return backups.sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  async verifyBackup(filepath: string): Promise<boolean> {
    try {
      // Check if file is valid gzip
      await exec(`gzip -t ${filepath}`);
      return true;
    } catch {
      return false;
    }
  }
  
  async createManualBackup(userId: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `manual-backup-${timestamp}.sql.gz`;
    
    await this.exec(`
      docker exec quiz-db pg_dump -U quizuser quizdb |
      gzip > backups/${filename}
    `);
    
    // Audit log
    await this.auditLog.create({
      action: 'backup.create',
      userId,
      changes: { filename }
    });
    
    return { filename, success: true };
  }
  
  async restoreBackup(filename: string, userId: string) {
    const filepath = path.join(process.cwd(), 'backups', filename);
    
    // Verify backup exists and is valid
    if (!await this.verifyBackup(filepath)) {
      throw new BadRequestException('Invalid backup file');
    }
    
    // Create pre-restore backup
    await this.createManualBackup(userId);
    
    // Restore (THIS IS DESTRUCTIVE)
    await this.exec(`
      gunzip < ${filepath} |
      docker exec -i quiz-db psql -U quizuser -d quizdb
    `);
    
    // Audit log
    await this.auditLog.create({
      action: 'backup.restore',
      userId,
      changes: { filename }
    });
    
    return { success: true };
  }
  
  async getBackupStatus() {
    // Check if backup service is healthy
    const lastBackup = (await this.listBackups())[0];
    
    const hoursSinceLastBackup = lastBackup
      ? (Date.now() - lastBackup.createdAt.getTime()) / (1000 * 60 * 60)
      : 999;
    
    return {
      healthy: hoursSinceLastBackup < 26,  // Within 26 hours
      lastBackup: lastBackup?.createdAt,
      totalBackups: (await this.listBackups()).length,
      totalSize: (await this.listBackups())
        .reduce((sum, b) => sum + b.size, 0)
    };
  }
}
```

**Frontend:**
```tsx
// pages/admin/Backups.tsx
<div className="backups-management">
  <div className="header flex justify-between items-center">
    <h1>Backup Management</h1>
    <button onClick={createManualBackup} className="btn-primary">
      Create Manual Backup
    </button>
  </div>
  
  {/* Status Card */}
  <div className={`status-card ${status.healthy ? 'bg-green-50' : 'bg-red-50'}`}>
    <div className="flex items-center gap-2">
      {status.healthy ? (
        <CheckCircleIcon className="text-green-600" />
      ) : (
        <XCircleIcon className="text-red-600" />
      )}
      <div>
        <h3>{status.healthy ? 'Backups Healthy' : 'Backup Issue'}</h3>
        <p>
          Last backup: {formatTimeAgo(status.lastBackup)}
        </p>
      </div>
    </div>
  </div>
  
  {/* Backups List */}
  <div className="backups-list mt-8">
    <h2>Available Backups ({backups.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Date</th>
          <th>Size</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {backups.map(backup => (
          <tr key={backup.filename}>
            <td>{backup.filename}</td>
            <td>{formatDate(backup.createdAt)}</td>
            <td>{formatFileSize(backup.size)}</td>
            <td>
              {backup.verified ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Badge variant="danger">Corrupt</Badge>
              )}
            </td>
            <td>
              <div className="flex gap-2">
                <button onClick={() => downloadBackup(backup.filename)}>
                  Download
                </button>
                {backup.verified && (
                  <button
                    onClick={() => restoreBackup(backup.filename)}
                    className="text-red-600"
                  >
                    Restore
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Restore Confirmation Modal */}
  <Modal open={showRestoreModal} onClose={() => setShowRestoreModal(false)}>
    <div className="p-6">
      <h3 className="text-xl font-bold text-red-600">⚠️ Warning</h3>
      <p className="mt-2">
        Restoring a backup will REPLACE all current data.
        This action cannot be undone.
      </p>
      <p className="mt-2">
        A pre-restore backup will be created automatically.
      </p>
      
      <div className="mt-4 flex gap-2 justify-end">
        <button onClick={() => setShowRestoreModal(false)}>
          Cancel
        </button>
        <button
          onClick={confirmRestore}
          className="btn-danger"
        >
          Yes, Restore Backup
        </button>
      </div>
    </div>
  </Modal>
</div>
```

---

## 💾 DATABASE CHANGES

### New Tables

```prisma
// Quiz versioning
model QuizVersion {
  id                String   @id @default(uuid())
  quizId            String
  quiz              Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  version           Int
  title             String
  description       String?
  difficulty        QuestionDifficulty
  timeLimit         Int?
  questionsSnapshot Json
  createdBy         String
  createdAt         DateTime @default(now())
  changeNote        String?
  isActive          Boolean  @default(false)
  
  @@unique([quizId, version])
  @@index([quizId])
}

// Audit logs
model AuditLog {
  id         String   @id @default(uuid())
  action     String
  entityType String
  entityId   String
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  changes    Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())
  
  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}

// User suspension
model User {
  // ... existing fields
  isSuspended      Boolean  @default(false)
  suspensionReason String?
  suspendedAt      DateTime?
  suspendedBy      String?
}
```

### Migrations

```bash
npx prisma migrate dev --name add_versioning_and_audit_logs
```

---

## ✅ ACCEPTANCE CRITERIA

### Feature Completion

- [ ] **Preview System**
  - Admin can preview quiz before publish
  - Preview mode clearly marked
  - Can edit and re-preview
  - Publish button functional

- [ ] **Versioning**
  - All quiz edits create new version
  - Version history visible
  - Rollback functional
  - Version comparison works

- [ ] **Bulk Operations**
  - Can upload 50+ files simultaneously
  - Progress shown per file
  - Can bulk edit category/difficulty
  - Bulk delete with confirmation

- [ ] **Search & Filter**
  - Full-text search functional
  - Multiple filters work together
  - Results instant (<500ms)
  - Sort options work

- [ ] **User Management**
  - User list with stats
  - Search and filter users
  - User detail page complete
  - Password reset works
  - Suspension functional

- [ ] **Analytics Dashboard**
  - Quiz stats accurate
  - Question difficulty correct
  - Charts render properly
  - All quizzes overview functional

- [ ] **Automated Backups**
  - Daily backups running
  - Backup verification works
  - Manual backup functional
  - Restore tested and working

### Performance Criteria

- [ ] Search returns results in <500ms
- [ ] Bulk upload processes 50 files in <5 minutes
- [ ] Analytics dashboard loads in <2s
- [ ] Version history loads in <1s

### Operational Criteria

- [ ] Zero backup failures for 7 days
- [ ] Admin time reduced 60%
- [ ] Content errors reduced 90%
- [ ] All admin actions logged

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Restore Backup Destroys Data

**Probability:** Low  
**Impact:** CRITICAL

**Mitigation:**
- [ ] Require explicit confirmation ("type 'RESTORE' to confirm")
- [ ] Auto-create pre-restore backup
- [ ] Test restore on staging first
- [ ] Document restore procedure
- [ ] Limit restore to super-admins only

---

### Risk 2: Version Storage Grows Unbounded

**Probability:** Medium  
**Impact:** Medium

**Mitigation:**
- [ ] Keep only last 10 versions per quiz
- [ ] Archive old versions after 90 days
- [ ] Compress version snapshots (gzip JSON)
- [ ] Monitor storage usage

---

### Risk 3: Bulk Operations Timeout

**Probability:** Medium  
**Impact:** Low

**Mitigation:**
- [ ] Use Phase 1's BullMQ for queuing
- [ ] Process in batches of 10
- [ ] Show progress for each file
- [ ] Allow partial success (don't fail all if one fails)

---

## 📅 TIMELINE

### Week 1: Preview & Versioning

**Days 1-2: Preview System**
- Backend endpoints
- Frontend preview page
- Test mode logic

**Days 3-5: Versioning**
- Database schema
- Versioning service
- Frontend version history
- Rollback functionality

---

### Week 2: Bulk Operations & Search

**Days 1-2: Bulk Upload**
- Multi-file upload UI
- Progress tracking
- Integration with BullMQ

**Days 3: Bulk Edit/Delete**
- Selection UI
- Bulk action endpoints
- Confirmation modals

**Days 4-5: Advanced Search**
- Search service
- Filter UI
- Sort functionality

---

### Week 3: User Management & Analytics

**Days 1-3: User Management**
- User dashboard
- User detail page
- Admin actions (reset password, suspend)

**Days 4-5: Quiz Analytics**
- Analytics service
- Charts and visualizations
- All quizzes overview

---

### Week 4: Backups & Polish

**Days 1-2: Automated Backups**
- Docker backup service
- Backup management UI
- Restore functionality

**Days 3-4: Testing**
- Full regression testing
- Security audit
- Performance testing

**Day 5: Documentation & Deploy**
- Admin guide
- Video tutorials
- Deploy to production

---

## 📦 DELIVERABLES

### Code Deliverables

```
backend/src/
├── versioning/
│   ├── versioning.service.ts
│   └── dto/
├── bulk/
│   └── bulk-operations.service.ts
├── audit/
│   └── audit-log.service.ts
├── backup/
│   └── backup.service.ts

frontend/src/pages/admin/
├── QuizPreview.tsx
├── QuizVersionHistory.tsx
├── BulkUpload.tsx
├── ManageQuizzes.tsx (enhanced)
├── UserManagement.tsx
├── UserDetail.tsx
├── QuizAnalytics.tsx
├── AllQuizzesAnalytics.tsx
└── Backups.tsx
```

### Documentation Deliverables

- [ ] **Admin Guide** - Complete admin manual
- [ ] **Backup & Restore Guide** - Step-by-step restore procedure
- [ ] **Versioning Guide** - How to use versions
- [ ] **Bulk Operations Guide** - Best practices for bulk uploads

---

## 🏁 DEFINITION OF DONE

Phase 3 is **COMPLETE** when:

- [ ] All 7 features implemented
- [ ] Admin time reduced 60%
- [ ] Content errors reduced 90%
- [ ] Automated backups running daily
- [ ] All admin actions logged
- [ ] Zero critical bugs
- [ ] Admin training completed
- [ ] Documentation complete
- [ ] Stakeholder approval

---

**Prepared by:** Development Team  
**Approved by:** Product Owner  
**Depends on:** Phase 1 (BullMQ, logging)  
**Start Date:** TBD  
**Target Completion:** TBD + 3-4 weeks  
**Status:** Ready After Phase 1 🟡
