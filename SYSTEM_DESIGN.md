# 🏗️ SYSTEM DESIGN - Quiz Practice System v2.0

## 📋 Project Overview

**Project Name:** Quiz Practice System  
**Version:** 2.0 (Full-stack)  
**Environment:** Internal Network (Intranet)  
**Scale:** Small (< 100 users, < 20 concurrent)  
**Timeline:** 3-4 weeks  
**Deployment:** Single server via Docker Compose

---

## 🎯 Requirements Summary

### Functional Requirements
1. ✅ User registration & authentication
2. ✅ Admin upload Word file → Parse → Create quiz
3. ✅ Users take quiz with basic features
4. ✅ Auto-grading & instant results
5. ✅ Quiz history & detailed review
6. ✅ Admin CRUD operations on quizzes

### Non-Functional Requirements
1. ✅ Support < 20 concurrent users
2. ✅ HTTP only (no HTTPS/domain)
3. ✅ Manual database backup
4. ✅ Basic security (JWT, bcrypt, rate limiting)
5. ✅ Responsive UI (desktop + tablet + mobile)

### Out of Scope (Phase 1)
- ❌ Leaderboard
- ❌ Categories/Tags
- ❌ Public/Private quiz visibility
- ❌ Email notifications
- ❌ 2FA
- ❌ Advanced analytics

---

## 🏛️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  INTERNAL NETWORK                        │
│                                                          │
│  ┌──────────────┐                                       │
│  │   Clients    │                                       │
│  │  (Browsers)  │                                       │
│  └──────┬───────┘                                       │
│         │ HTTP                                          │
│         ▼                                               │
│  ┌──────────────────────────────────────┐              │
│  │         Docker Compose Host           │              │
│  │                                       │              │
│  │  ┌────────────────────────────────┐  │              │
│  │  │   React Frontend (Vite)        │  │              │
│  │  │   Container: quiz-frontend     │  │              │
│  │  │   Port: 3000                   │  │              │
│  │  │   Tech: React 18 + TailwindCSS │  │              │
│  │  └─────────────┬──────────────────┘  │              │
│  │                │ HTTP REST API        │              │
│  │  ┌─────────────▼──────────────────┐  │              │
│  │  │   NestJS Backend               │  │              │
│  │  │   Container: quiz-backend      │  │              │
│  │  │   Port: 4000                   │  │              │
│  │  │   Tech: NestJS + Prisma        │  │              │
│  │  └─────────────┬──────────────────┘  │              │
│  │                │                      │              │
│  │  ┌─────────────▼──────────────────┐  │              │
│  │  │   PostgreSQL Database          │  │              │
│  │  │   Container: quiz-db           │  │              │
│  │  │   Port: 5432                   │  │              │
│  │  │   Volume: postgres-data        │  │              │
│  │  └────────────────────────────────┘  │              │
│  │                                       │              │
│  └───────────────────────────────────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.x | UI Framework |
| Build Tool | Vite | 5.x | Fast dev server & build |
| Styling | TailwindCSS | 3.x | Utility-first CSS |
| State Management | React Context | Built-in | Auth state |
| HTTP Client | Axios | 1.x | API communication |
| Backend | NestJS | 10.x | Node.js framework |
| ORM | Prisma | 5.x | Database toolkit |
| Database | PostgreSQL | 16.x | Relational database |
| Auth | JWT | - | Token-based auth |
| Password Hash | bcrypt | - | Password encryption |
| Word Parser | mammoth | - | .docx parsing |
| Container | Docker | 24.x | Containerization |
| Orchestration | Docker Compose | 2.x | Multi-container |

---

## 🗄️ DATABASE DESIGN

### Entity Relationship Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │ 1
       │
       │ n
┌──────▼──────────┐         ┌──────────────┐
│ quiz_attempts   │ n     1 │   quizzes    │
└──────┬──────────┘◄────────┤──────┬───────┘
       │ 1                          │ 1
       │                            │
       │ n                          │ n
┌──────▼──────────────┐      ┌─────▼──────────┐
│ attempt_answers     │      │   questions    │
└──────┬──────────────┘      └─────┬──────────┘
       │ n                          │ 1
       │                            │
       │ 1                          │ n
       └──────►┌────────────────┐◄──┘
                │question_options│
                └────────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MANAGEMENT
// ============================================

enum UserRole {
  USER
  ADMIN
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  fullName  String?
  role      UserRole @default(USER)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  attempts  QuizAttempt[]
  
  @@map("users")
}

// ============================================
// QUIZ STRUCTURE
// ============================================

model Quiz {
  id          String   @id @default(uuid())
  title       String
  description String?
  
  // Metadata
  totalQuestions Int
  createdBy      String?  // Email or name of admin who uploaded
  fileName       String?  // Original .docx filename
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  questions   Question[]
  attempts    QuizAttempt[]
  
  @@map("quizzes")
}

model Question {
  id       String @id @default(uuid())
  quizId   String
  
  // Question content
  text     String   @db.Text
  order    Int      // Order in the quiz (1, 2, 3, ...)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  quiz     Quiz              @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options  QuestionOption[]
  answers  AttemptAnswer[]
  
  @@map("questions")
  @@index([quizId])
}

model QuestionOption {
  id         String  @id @default(uuid())
  questionId String
  
  // Option content
  label      String  // A, B, C, D
  text       String  @db.Text
  isCorrect  Boolean @default(false)
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations
  question   Question        @relation(fields: [questionId], references: [id], onDelete: Cascade)
  answers    AttemptAnswer[]
  
  @@map("question_options")
  @@index([questionId])
}

// ============================================
// QUIZ ATTEMPTS & RESULTS
// ============================================

enum AttemptStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

model QuizAttempt {
  id      String        @id @default(uuid())
  userId  String
  quizId  String
  
  // Attempt metadata
  status       AttemptStatus @default(IN_PROGRESS)
  score        Int?          // Null if not completed
  totalQuestions Int
  correctAnswers Int?        // Null if not completed
  
  // Timing
  startedAt    DateTime      @default(now())
  completedAt  DateTime?
  timeSpent    Int?          // Seconds
  
  // Relations
  user    User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  quiz    Quiz            @relation(fields: [quizId], references: [id], onDelete: Cascade)
  answers AttemptAnswer[]
  
  @@map("quiz_attempts")
  @@index([userId])
  @@index([quizId])
}

model AttemptAnswer {
  id              String  @id @default(uuid())
  attemptId       String
  questionId      String
  selectedOptionId String?  // Null if not answered
  
  // Result
  isCorrect       Boolean @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  attempt         QuizAttempt    @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question        Question       @relation(fields: [questionId], references: [id], onDelete: Cascade)
  selectedOption  QuestionOption? @relation(fields: [selectedOptionId], references: [id], onDelete: SetNull)
  
  @@map("attempt_answers")
  @@index([attemptId])
  @@unique([attemptId, questionId]) // One answer per question per attempt
}
```

### Database Indexes

**Purpose:** Optimize query performance for common operations

- `users.email` - Unique index (login lookup)
- `questions.quizId` - Foreign key index (fetch all questions for a quiz)
- `question_options.questionId` - Foreign key index
- `quiz_attempts.userId` - Index (user history)
- `quiz_attempts.quizId` - Index (quiz statistics)
- `attempt_answers.attemptId` - Index (fetch all answers for an attempt)

### Sample Data Flow

**Example: User takes quiz and submits**

```sql
-- 1. Create attempt
INSERT INTO quiz_attempts (id, userId, quizId, status, totalQuestions, startedAt)
VALUES ('attempt-uuid', 'user-uuid', 'quiz-uuid', 'IN_PROGRESS', 50, NOW());

-- 2. Save answers (as user answers each question)
INSERT INTO attempt_answers (id, attemptId, questionId, selectedOptionId, isCorrect)
VALUES 
  ('ans-1', 'attempt-uuid', 'q1-uuid', 'opt-b-uuid', true),
  ('ans-2', 'attempt-uuid', 'q2-uuid', 'opt-c-uuid', false),
  ...

-- 3. Complete attempt
UPDATE quiz_attempts
SET 
  status = 'COMPLETED',
  completedAt = NOW(),
  timeSpent = 3600,
  correctAnswers = 42,
  score = 84
WHERE id = 'attempt-uuid';
```

---

## 🔐 AUTHENTICATION FLOW

### JWT Strategy

**Token Types:**
1. **Access Token**: Short-lived (15 minutes), used for API requests
2. **Refresh Token**: Long-lived (7 days), used to get new access tokens

**Token Payload:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234568790
}
```

### Authentication Sequence

```
┌──────────┐                 ┌──────────┐                 ┌──────────┐
│ Frontend │                 │ Backend  │                 │ Database │
└────┬─────┘                 └────┬─────┘                 └────┬─────┘
     │                            │                            │
     │ 1. POST /auth/login        │                            │
     ├───────────────────────────►│                            │
     │   { email, password }      │                            │
     │                            │ 2. Query user by email     │
     │                            ├───────────────────────────►│
     │                            │                            │
     │                            │ 3. Return user             │
     │                            │◄───────────────────────────┤
     │                            │                            │
     │                            │ 4. Verify password (bcrypt)│
     │                            │                            │
     │ 5. Return tokens           │                            │
     │◄───────────────────────────┤                            │
     │ { accessToken, refreshToken }                          │
     │                            │                            │
     │ 6. Store tokens (memory)   │                            │
     │                            │                            │
     │ 7. API Request with header │                            │
     ├───────────────────────────►│                            │
     │ Authorization: Bearer {token}                          │
     │                            │ 8. Verify JWT              │
     │                            │                            │
     │ 9. Return protected data   │                            │
     │◄───────────────────────────┤                            │
     │                            │                            │
```

### Security Measures

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Secret**: Strong random secret (stored in .env)
3. **Token Expiry**: Access token 15m, Refresh token 7d
4. **HTTP-Only Cookies** (Optional): For refresh tokens
5. **Rate Limiting**: Max 5 login attempts per minute per IP
6. **Input Validation**: All inputs validated with class-validator

---

## 📡 API SPECIFICATION

### Base URL
```
http://<server-ip>:4000/api
```

### Common Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "statusCode": 400
}
```

---

### 🔑 AUTH Module

#### POST `/auth/register`
**Description:** Register new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

**Validation:**
- Email: Valid format, unique
- Password: Min 8 chars, at least 1 uppercase, 1 number
- FullName: Optional, max 100 chars

---

#### POST `/auth/login`
**Description:** Login existing user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

**Errors:**
- 401: Invalid credentials
- 429: Too many requests (rate limited)

---

#### POST `/auth/refresh`
**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

---

#### GET `/auth/me`
**Description:** Get current user profile

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 👤 USERS Module

#### PATCH `/users/profile`
**Description:** Update user profile

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "fullName": "Jane Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PATCH `/users/password`
**Description:** Change user password

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Errors:**
- 401: Current password incorrect
- 400: New password does not meet requirements

---

### 📚 QUIZZES Module

#### POST `/quizzes/import` 🔒 ADMIN ONLY
**Description:** Upload and parse Word file to create quiz

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: [.docx file]
title: "AI & Machine Learning Quiz"
description: "Test your knowledge on AI concepts"
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "id": "uuid",
      "title": "AI & Machine Learning Quiz",
      "description": "Test your knowledge on AI concepts",
      "totalQuestions": 50,
      "fileName": "ai_quiz.docx",
      "createdBy": "admin@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "stats": {
      "questionsCreated": 50,
      "optionsCreated": 200
    }
  }
}
```

**Errors:**
- 400: Invalid file format (not .docx)
- 400: File parsing failed
- 400: No valid questions found
- 403: Forbidden (not admin)

---

#### GET `/quizzes`
**Description:** Get list of all quizzes (public)

**Query Params:**
```
page=1 (default: 1)
limit=10 (default: 10, max: 100)
search=AI (optional: search in title/description)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quizzes": [
      {
        "id": "uuid",
        "title": "AI & Machine Learning Quiz",
        "description": "Test your knowledge...",
        "totalQuestions": 50,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

---

#### GET `/quizzes/:id`
**Description:** Get quiz details (metadata only, no questions)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI & Machine Learning Quiz",
    "description": "Test your knowledge...",
    "totalQuestions": 50,
    "fileName": "ai_quiz.docx",
    "createdAt": "2024-01-01T00:00:00Z",
    "stats": {
      "totalAttempts": 123,
      "averageScore": 78.5
    }
  }
}
```

---

#### DELETE `/quizzes/:id` 🔒 ADMIN ONLY
**Description:** Delete quiz and all related data

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

**Note:** Cascades to questions, options, attempts

---

### ❓ QUESTIONS Module

#### GET `/questions/quiz/:quizId`
**Description:** Get all questions for a quiz (to start quiz)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Params:**
```
shuffle=true (default: false) - Shuffle question order
shuffleOptions=true (default: false) - Shuffle option order
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quizId": "uuid",
    "questions": [
      {
        "id": "uuid",
        "text": "What is the primary use of SVM?",
        "order": 1,
        "options": [
          {
            "id": "uuid",
            "label": "A",
            "text": "Reinforcement Learning"
          },
          {
            "id": "uuid",
            "label": "B",
            "text": "Classification"
          },
          {
            "id": "uuid",
            "label": "C",
            "text": "Clustering"
          },
          {
            "id": "uuid",
            "label": "D",
            "text": "Regression"
          }
        ]
      }
    ]
  }
}
```

**Note:** Does NOT include `isCorrect` field in options

---

### 📝 ATTEMPTS Module

#### POST `/attempts/start`
**Description:** Start a new quiz attempt

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "quizId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "quizId": "uuid",
    "status": "IN_PROGRESS",
    "startedAt": "2024-01-01T12:00:00Z",
    "totalQuestions": 50
  }
}
```

---

#### POST `/attempts/:attemptId/answer`
**Description:** Submit answer for a question (can be called multiple times)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "questionId": "uuid",
  "selectedOptionId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Answer saved"
}
```

**Note:** Does NOT reveal if answer is correct (for security)

---

#### POST `/attempts/:attemptId/submit`
**Description:** Complete quiz attempt and calculate score

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "timeSpent": 3600
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "status": "COMPLETED",
    "score": 84,
    "correctAnswers": 42,
    "totalQuestions": 50,
    "timeSpent": 3600,
    "completedAt": "2024-01-01T13:00:00Z"
  }
}
```

---

#### GET `/attempts/my`
**Description:** Get user's quiz attempt history

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Params:**
```
page=1
limit=10
quizId=uuid (optional: filter by quiz)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attempts": [
      {
        "id": "uuid",
        "quizTitle": "AI & Machine Learning Quiz",
        "status": "COMPLETED",
        "score": 84,
        "correctAnswers": 42,
        "totalQuestions": 50,
        "timeSpent": 3600,
        "startedAt": "2024-01-01T12:00:00Z",
        "completedAt": "2024-01-01T13:00:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10
    }
  }
}
```

---

#### GET `/attempts/:attemptId/review`
**Description:** Get detailed review of completed attempt (with correct answers)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": "uuid",
      "quizTitle": "AI & Machine Learning Quiz",
      "score": 84,
      "correctAnswers": 42,
      "totalQuestions": 50,
      "completedAt": "2024-01-01T13:00:00Z"
    },
    "answers": [
      {
        "questionId": "uuid",
        "questionText": "What is the primary use of SVM?",
        "selectedOption": {
          "id": "uuid",
          "label": "B",
          "text": "Classification"
        },
        "correctOption": {
          "id": "uuid",
          "label": "B",
          "text": "Classification"
        },
        "isCorrect": true
      },
      {
        "questionId": "uuid",
        "questionText": "What does CNN stand for?",
        "selectedOption": {
          "id": "uuid",
          "label": "A",
          "text": "Computer Neural Network"
        },
        "correctOption": {
          "id": "uuid",
          "label": "C",
          "text": "Convolutional Neural Network"
        },
        "isCorrect": false
      }
    ]
  }
}
```

---

## 🔍 WORD PARSER LOGIC

### Input Format (Expected)

```
Câu 1. What is the primary use of SVM?
A. Reinforcement Learning
B. Classification
C. Clustering
D. Regression
Đáp án: B

Câu 2. What does CNN stand for?
A. Computer Neural Network
B. Cloud Neural Network
C. Convolutional Neural Network
D. Centralized Neural Network
Đáp án: C
```

### Parsing Algorithm

```javascript
// Backend service: src/quizzes/services/parser.service.ts

async parseDocx(buffer: Buffer): Promise<ParsedQuiz> {
  // 1. Extract raw text using mammoth
  const result = await mammoth.extractRawText({ buffer });
  const rawText = result.value;
  
  // 2. Split into lines
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);
  
  // 3. Parse questions
  const questions = [];
  let currentQuestion = null;
  
  for (const line of lines) {
    // Match question: "Câu 1. [text]"
    const questionMatch = line.match(/^Câu\s+(\d+)\.\s*(.+)$/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        order: parseInt(questionMatch[1]),
        text: questionMatch[2],
        options: [],
        correctAnswer: null
      };
      continue;
    }
    
    // Match option: "A. [text]"
    const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch && currentQuestion) {
      currentQuestion.options.push({
        label: optionMatch[1],
        text: optionMatch[2]
      });
      continue;
    }
    
    // Match correct answer: "Đáp án: B"
    const answerMatch = line.match(/^Đáp án:\s*([A-D])$/i);
    if (answerMatch && currentQuestion) {
      currentQuestion.correctAnswer = answerMatch[1];
      continue;
    }
  }
  
  // Push last question
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  // 4. Validate questions
  const validQuestions = questions.filter(q => 
    q.text && 
    q.options.length >= 2 &&
    q.correctAnswer &&
    q.options.some(opt => opt.label === q.correctAnswer)
  );
  
  if (validQuestions.length === 0) {
    throw new Error('No valid questions found in document');
  }
  
  return {
    questions: validQuestions,
    totalParsed: questions.length,
    totalValid: validQuestions.length
  };
}
```

### Database Insertion Logic

```javascript
// Create quiz and questions in transaction
async createQuizFromParsed(
  parsed: ParsedQuiz,
  title: string,
  userId: string
) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Create quiz
    const quiz = await tx.quiz.create({
      data: {
        title,
        totalQuestions: parsed.totalValid,
        createdBy: userId
      }
    });
    
    // 2. Create questions with options
    for (const q of parsed.questions) {
      const question = await tx.question.create({
        data: {
          quizId: quiz.id,
          text: q.text,
          order: q.order,
          options: {
            create: q.options.map(opt => ({
              label: opt.label,
              text: opt.text,
              isCorrect: opt.label === q.correctAnswer
            }))
          }
        }
      });
    }
    
    return quiz;
  });
}
```

### Error Handling

| Error | Reason | HTTP Code |
|-------|--------|-----------|
| Invalid file format | Not .docx | 400 |
| Parse failed | Mammoth error | 500 |
| No questions found | Empty or wrong format | 400 |
| Invalid question | Missing options/answer | 400 |

---

## 🎨 FRONTEND STRUCTURE

### File Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Loading.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx (admin)
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── quiz/
│   │   │   ├── QuizCard.jsx
│   │   │   ├── QuestionDisplay.jsx
│   │   │   ├── OptionButton.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── Timer.jsx
│   │   │
│   │   └── history/
│   │       ├── AttemptCard.jsx
│   │       └── ReviewQuestion.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── QuizList.jsx
│   │   │   ├── QuizDetail.jsx
│   │   │   ├── QuizRunner.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── History.jsx
│   │   │   ├── AttemptReview.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── UploadQuiz.jsx
│   │       └── ManageQuizzes.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useQuiz.js
│   │   └── useAttempt.js
│   │
│   ├── services/
│   │   ├── api.js (axios instance)
│   │   ├── authService.js
│   │   ├── quizService.js
│   │   └── attemptService.js
│   │
│   ├── utils/
│   │   ├── formatTime.js
│   │   ├── calculateScore.js
│   │   └── validators.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

### Page Descriptions

#### 1. **Login.jsx**
- Email/password form
- Remember me checkbox
- Link to register
- JWT token stored in memory (React Context)

#### 2. **Register.jsx**
- Email, password, full name form
- Password strength indicator
- Auto-login after successful registration

#### 3. **Dashboard.jsx** (User)
- Welcome message
- Quick stats (total quizzes taken, average score)
- Recent quizzes
- CTA to browse quizzes

#### 4. **QuizList.jsx**
- Grid/list of available quizzes
- Search bar
- Pagination
- Click quiz → QuizDetail

#### 5. **QuizDetail.jsx**
- Quiz title, description
- Total questions, average score
- "Start Quiz" button
- User's previous attempts (if any)

#### 6. **QuizRunner.jsx** ⭐ CORE FEATURE
- State management:
  ```javascript
  {
    attemptId: 'uuid',
    questions: [...],
    currentIndex: 0,
    answers: {}, // { questionId: optionId }
    timeElapsed: 0
  }
  ```
- Features:
  - Question display with options
  - Previous/Next navigation
  - Progress bar
  - Timer (counts up)
  - Submit confirmation modal
- API calls:
  - GET `/questions/quiz/:id` on mount
  - POST `/attempts/start` on mount
  - POST `/attempts/:id/answer` on each answer
  - POST `/attempts/:id/submit` on submit

#### 7. **QuizResult.jsx**
- Score display (large)
- Percentage
- Time taken
- "Review Answers" button
- "Take Another Quiz" button

#### 8. **History.jsx**
- List of user's attempts
- Filters: quiz, date range
- Sorting: newest first
- Click attempt → AttemptReview

#### 9. **AttemptReview.jsx**
- Detailed review of each question
- Show selected answer vs correct answer
- Highlight correct/incorrect
- Option to retake quiz

#### 10. **Profile.jsx**
- Display user info
- Edit full name
- Change password form

#### 11. **AdminDashboard.jsx** (Admin only)
- Stats: total quizzes, total attempts
- Recent uploads
- Quick actions

#### 12. **UploadQuiz.jsx** (Admin only)
- File upload (drag & drop or click)
- Title & description inputs
- Preview parsed questions (optional)
- Submit button
- Progress indicator

#### 13. **ManageQuizzes.jsx** (Admin only)
- Table of all quizzes
- Edit (title/description)
- Delete with confirmation
- View attempts statistics

---

### Routing

```javascript
// App.jsx with React Router

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
            <Route path="/quiz/:id/take" element={<QuizRunner />} />
            <Route path="/quiz/result/:attemptId" element={<QuizResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/attempt/:id/review" element={<AttemptReview />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Protected admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/upload" element={<UploadQuiz />} />
            <Route path="/admin/quizzes" element={<ManageQuizzes />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 🧪 TESTING STRATEGY

### Backend Testing

**Unit Tests (Jest):**
- `auth.service.spec.ts` - Hash password, verify JWT
- `parser.service.spec.ts` - Parse docx, validate questions
- `quiz.service.spec.ts` - CRUD operations

**Integration Tests (Supertest):**
- Auth flow: register → login → protected route
- Quiz flow: create → fetch → delete
- Attempt flow: start → answer → submit

**Test Data:**
- Sample .docx files (valid + invalid formats)
- Mock user data
- Mock quiz data

### Frontend Testing

**Manual Testing Checklist:**
- ✅ User can register
- ✅ User can login
- ✅ User can browse quizzes
- ✅ User can take quiz
- ✅ Answers are saved
- ✅ Submit shows correct score
- ✅ Review shows correct answers
- ✅ Admin can upload quiz
- ✅ Admin can delete quiz

**E2E Testing (Optional - Playwright):**
- Full user journey: register → take quiz → view result

---

## 🚀 DEPLOYMENT

### Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: quiz-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: quizuser
      POSTGRES_PASSWORD: quizpass
      POSTGRES_DB: quizdb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - quiz-network

  # NestJS Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: quiz-backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://quizuser:quizpass@db:5432/quizdb
      JWT_SECRET: your-super-secret-jwt-key-change-in-production
      JWT_REFRESH_SECRET: your-super-secret-refresh-key
      PORT: 4000
    ports:
      - "4000:4000"
    depends_on:
      - db
    networks:
      - quiz-network
    volumes:
      - ./backend:/app
      - /app/node_modules

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: quiz-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:4000/api
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - quiz-network

networks:
  quiz-network:
    driver: bridge

volumes:
  postgres-data:
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 4000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://quizuser:quizpass@db:5432/quizdb
JWT_SECRET=change-this-to-random-secret-in-production
JWT_REFRESH_SECRET=change-this-to-another-random-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=4000
```

**Frontend (.env):**
```
VITE_API_URL=http://<server-ip>:4000/api
```

---

## 📦 DEPLOYMENT STEPS

### 1. Prepare Server
```bash
# Install Docker & Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y

# Clone repository
git clone <repo-url>
cd quiz-practice-system
```

### 2. Configure Environment
```bash
# Copy and edit .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with actual values
nano backend/.env
nano frontend/.env
```

### 3. Build and Run
```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Initialize Database
```bash
# Run Prisma migrations
docker-compose exec backend npx prisma migrate deploy

# (Optional) Seed initial admin user
docker-compose exec backend npm run seed
```

### 5. Access Application
```
Frontend: http://<server-ip>:3000
Backend API: http://<server-ip>:4000/api
```

### 6. Create First Admin
```bash
# Option A: Seed script
docker-compose exec backend npm run seed:admin

# Option B: Direct database insert
docker-compose exec db psql -U quizuser -d quizdb
INSERT INTO users (id, email, password, role, "fullName") 
VALUES (
  gen_random_uuid(), 
  'admin@example.com', 
  '$2b$10$...', -- bcrypt hash of 'admin123'
  'ADMIN',
  'System Admin'
);
```

---

## 🔧 MAINTENANCE

### Backup Database
```bash
# Manual backup
docker-compose exec db pg_dump -U quizuser quizdb > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T db psql -U quizuser quizdb < backup_20240101.sql
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📊 PERFORMANCE CONSIDERATIONS

### Expected Load
- **Users**: < 100 total, < 20 concurrent
- **Database**: < 1000 quizzes, < 10,000 attempts
- **File uploads**: < 10 MB per .docx

### Optimizations
1. **Database Indexes** - Already defined in schema
2. **Connection Pooling** - Prisma default (10 connections)
3. **API Rate Limiting** - 100 requests/min per IP
4. **File Size Limit** - 10 MB max for .docx uploads

### No Need For (Small Scale)
- ❌ Redis caching
- ❌ CDN
- ❌ Load balancer
- ❌ Horizontal scaling

---

## 🎯 SUCCESS METRICS

### Phase 1 (MVP) - Week 3
- ✅ User registration & login working
- ✅ Admin can upload .docx and create quiz
- ✅ User can take quiz and submit
- ✅ Score calculation accurate
- ✅ History and review working

### Phase 2 (Polish) - Week 4
- ✅ All pages responsive (mobile/tablet)
- ✅ Error handling comprehensive
- ✅ Loading states smooth
- ✅ Basic tests passing
- ✅ Deployed and accessible

---

## 📝 NEXT STEPS

After this design document, I will create:
1. **PLAN.md** - Detailed implementation steps for Cursor
2. **API_EXAMPLES.md** - Sample requests/responses for testing
3. **SEED_DATA.sql** - Initial data for testing

---

**End of System Design Document**
