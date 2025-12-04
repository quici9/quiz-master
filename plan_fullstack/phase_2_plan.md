# 🎨 PHASE 2: ENHANCED USER EXPERIENCE

**Duration:** 3-4 weeks  
**Priority:** 🔴 HIGH  
**Team Size:** 2-3 Full-stack developers + 1 UI/UX designer  
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

Phase 2 transforms QuizMaster from a functional quiz platform into an **engaging learning experience** by adding practice modes, personalization, analytics, and visual polish. This phase focuses entirely on **improving user engagement and retention**.

**Key Focus Areas:**
- 🎯 Practice modes (Quick, Review, Bookmarked, Wrong questions)
- 🎨 Visual improvements (Dark mode, Charts, Animations)
- 📊 Learning analytics (Topic performance, Weak areas)
- 🔀 Randomization (Shuffle questions/options)
- 💡 User preferences (Dark mode, Font size)

---

## 🎯 OBJECTIVE

**Primary Goal:**  
Increase user engagement by **50%** and average session time by **30%** through personalized learning experiences and visual improvements.

**Specific Objectives:**
1. Reduce quiz abandonment rate by 25%
2. Increase quiz completion rate from 60% to 85%
3. Improve user satisfaction score to 4.5/5
4. Enable users to identify and practice weak topics
5. Provide visual feedback on learning progress

---

## 🤔 WHY THIS PHASE

### Current Pain Points

**Limited Practice Options:**
- Users can only take full quizzes (time-consuming)
- No way to practice specific topics quickly
- Cannot replay wrong questions easily
- Bookmarks exist but no practice mode

**Lack of Personalization:**
- All users see same content
- No visibility into weak topics
- No adaptive difficulty
- Generic experience for everyone

**Poor Visual Feedback:**
- Text-only results (boring)
- No progress visualization
- No visual encouragement
- Dark mode requested by 40% of users

**Learning Inefficiency:**
- Users repeat same mistakes
- No guidance on what to study next
- No historical trend data
- Cannot track improvement

### Business Impact

**Without This Phase:**
- ❌ High churn rate (users get bored)
- ❌ Low daily active users
- ❌ Short session times
- ❌ Poor word-of-mouth growth
- ❌ Limited competitive advantage

**With This Phase:**
- ✅ Users return daily for quick practice
- ✅ Clear learning paths keep users engaged
- ✅ Visual progress encourages persistence
- ✅ Dark mode improves evening study sessions
- ✅ Analytics help users improve faster

---

## 📦 SCOPE

### ✅ In Scope

**Practice Modes:**
- Quick Practice (5-20 random questions)
- Review Mode (instant feedback after each answer)
- Practice Bookmarked Questions
- Practice Wrong Questions Only

**Randomization:**
- Shuffle question order
- Shuffle option order (A/B/C/D)

**Analytics & Visualizations:**
- Topic-based performance breakdown
- Score trend charts (line chart)
- Accuracy by category (bar chart)
- Weekly progress summary

**UI/UX Improvements:**
- Dark mode (toggle + auto-detect)
- Improved quiz runner interface
- Loading skeletons
- Empty states
- Accessibility improvements

**User Preferences:**
- Dark/light mode preference
- Font size adjustment
- Default shuffle settings
- Notification preferences

### ❌ Out of Scope

- Achievements/Badges (Phase 4)
- Flashcards mode (Phase 4)
- Hints system (Phase 4)
- AI recommendations (Phase 5)
- Social features (Phase 4)
- Mobile app (Phase 4)

---

## 👥 USER STORIES

### As a **Student**

**US-2.1: Quick Practice Mode**
```
As a busy student,
I want to practice 10 random questions in 5 minutes,
So that I can study during short breaks.

Acceptance:
- Select question count (5/10/15/20)
- Random questions from all quizzes
- Optional category filter
- No time pressure (untimed)
- Instant feedback at end
```

**US-2.2: Review Mode**
```
As a learner who likes immediate feedback,
I want to see if my answer is correct right after selecting it,
So that I can learn from mistakes immediately.

Acceptance:
- See correct/wrong indicator after each answer
- View explanation (if available)
- Continue to next question
- Final summary at end
- Option to enable/disable review mode
```

**US-2.3: Practice Wrong Questions**
```
As someone trying to improve,
I want to practice only the questions I got wrong before,
So that I can focus on my weak areas.

Acceptance:
- View history of wrong answers
- Start practice session with wrong questions only
- Questions shuffled each time
- Track improvement over time
```

**US-2.4: Topic Analytics**
```
As a strategic learner,
I want to see which topics I'm weak in,
So that I can focus my study efforts.

Acceptance:
- See accuracy % by category/topic
- Visual chart showing performance
- Identify weakest topic
- One-click practice for weak topic
```

**US-2.5: Dark Mode**
```
As someone who studies at night,
I want a dark mode option,
So that I don't strain my eyes.

Acceptance:
- Toggle switch in navbar
- Smooth transition animation
- Preference saved
- Auto-detect OS preference (optional)
```

**US-2.6: Progress Visualization**
```
As a motivated student,
I want to see my progress over time in charts,
So that I feel encouraged to continue.

Acceptance:
- Line chart: score trend over time
- Bar chart: accuracy by category
- Weekly summary stats
- Personal records highlighted
```

### As a **Teacher Using The System**

**US-2.7: Student Practice Patterns**
```
As a teacher,
I want to see which practice modes students use most,
So that I can understand learning preferences.

Acceptance:
- Analytics show practice mode usage
- Identify popular practice types
- See average session time by mode
```

---

## 🎨 FEATURE BREAKDOWN

### Feature 1: Quick Practice Mode

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 5 days

**Description:**  
Allow users to quickly practice a small set of random questions without starting a full quiz.

**User Flow:**
```
1. User clicks "Quick Practice" in navbar
2. Select configuration:
   - Number of questions (5/10/15/20)
   - Category filter (optional: All, AI, Programming, etc.)
   - Difficulty filter (optional: All, Easy, Medium, Hard)
3. Click "Start Practice"
4. Questions displayed one-by-one
5. Submit all answers at end
6. View results (no leaderboard impact)
7. Option to "Practice Again" or "Practice Wrong Ones"
```

**Backend Implementation:**

```typescript
// New endpoint
GET /api/practice/quick
Query params:
  - count: number (5-20)
  - categoryId?: string
  - difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  - excludeRecent?: boolean (don't repeat recent questions)

Response:
{
  practiceId: string,  // Track this practice session
  questions: [
    {
      id: string,
      text: string,
      difficulty: string,
      options: [...]
    }
  ],
  totalQuestions: number
}

// Submit endpoint
POST /api/practice/:practiceId/submit
Body: {
  answers: [
    { questionId: string, selectedOptionId: string }
  ],
  timeSpent: number
}

Response: {
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  incorrectQuestions: [...],  // Wrong questions for retry
  breakdown: [
    { category: string, correct: number, total: number }
  ]
}
```

**Frontend Components:**
```
pages/QuickPractice/
├── QuickPracticeConfig.tsx   # Configuration screen
├── QuickPracticeRunner.tsx   # Question display
└── QuickPracticeResult.tsx   # Results with retry option
```

---

### Feature 2: Review Mode (Instant Feedback)

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 3 days

**Description:**  
Show correct/wrong feedback immediately after each answer selection, with explanations.

**Implementation Strategy:**

**Backend:**
```typescript
// No new endpoints needed
// Reuse existing quiz/practice endpoints
// Frontend handles instant feedback logic
```

**Frontend:**
```typescript
// State management
const [reviewMode, setReviewMode] = useState(true);
const [currentFeedback, setCurrentFeedback] = useState(null);

// When user selects answer in review mode
const handleAnswerSelect = (optionId: string) => {
  if (reviewMode) {
    // Show immediate feedback
    const correct = isCorrectOption(optionId);
    setCurrentFeedback({
      isCorrect: correct,
      correctOption: getCorrectOption(),
      explanation: question.explanation
    });
    
    // Allow proceeding after 2 seconds or manual "Next"
  } else {
    // Normal mode: just save answer
    saveAnswer(optionId);
  }
};
```

**UI States:**
```tsx
// Correct answer feedback
<div className="bg-green-100 border-green-500 p-4 rounded">
  <CheckIcon className="text-green-600" />
  <span>Correct! Well done.</span>
  {explanation && <p className="mt-2">{explanation}</p>}
</div>

// Wrong answer feedback
<div className="bg-red-100 border-red-500 p-4 rounded">
  <XIcon className="text-red-600" />
  <span>Incorrect. The correct answer is: {correctAnswer}</span>
  {explanation && <p className="mt-2">{explanation}</p>}
</div>
```

**Toggle Button:**
```tsx
<button onClick={() => setReviewMode(!reviewMode)}>
  {reviewMode ? 'Review Mode ON' : 'Exam Mode'}
  <Switch checked={reviewMode} />
</button>
```

---

### Feature 3: Shuffle Questions & Options

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐ Easy  
**Effort:** 2 days

**Description:**  
Randomize question order and option order to prevent pattern memorization.

**Backend Implementation:**

```typescript
// QuizzesService
async getQuizQuestions(quizId: string, options: {
  shuffleQuestions?: boolean,
  shuffleOptions?: boolean,
  userId: string
}) {
  let questions = await this.prisma.question.findMany({
    where: { quizId },
    include: { options: true },
    orderBy: { order: 'asc' }
  });
  
  // Shuffle questions
  if (options.shuffleQuestions) {
    questions = this.shuffleArray(questions);
  }
  
  // Shuffle options within each question
  if (options.shuffleOptions) {
    questions = questions.map(q => ({
      ...q,
      options: this.shuffleArray(q.options)
    }));
  }
  
  return questions;
}

private shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

**Frontend:**
```tsx
// Quiz start screen
<div className="flex gap-2">
  <Toggle
    label="Shuffle Questions"
    checked={shuffleQuestions}
    onChange={setShuffleQuestions}
  />
  <Toggle
    label="Shuffle Options (A/B/C/D)"
    checked={shuffleOptions}
    onChange={setShuffleOptions}
  />
</div>
```

**User Preference:**
```typescript
// Save preference
localStorage.setItem('preferShuffle', JSON.stringify({
  questions: true,
  options: true
}));
```

---

### Feature 4: Practice Bookmarked Questions

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 2 days

**Description:**  
Allow users to practice only questions they've bookmarked for review.

**Backend:**

```typescript
// New endpoint
GET /api/practice/bookmarked
Query: ?count=10

Response: {
  practiceId: string,
  questions: [...],  // User's bookmarked questions
  totalBookmarked: number
}
```

**Frontend:**
```tsx
// New page: BookmarkedPractice.tsx
<div>
  <h1>Practice Bookmarked Questions</h1>
  <p>You have {bookmarkCount} bookmarked questions</p>
  
  <button onClick={startBookmarkedPractice}>
    Practice All ({bookmarkCount})
  </button>
  
  <button onClick={() => startBookmarkedPractice(10)}>
    Practice 10 Random
  </button>
</div>
```

---

### Feature 5: Practice Wrong Questions

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 3 days

**Description:**  
Show history of wrong answers and allow focused practice on those questions.

**Database Query:**

```typescript
// AttemptsService
async getWrongQuestions(userId: string) {
  // Get all incorrect answers across all attempts
  const wrongAnswers = await this.prisma.attemptAnswer.findMany({
    where: {
      isCorrect: false,
      attempt: { userId }
    },
    include: {
      question: {
        include: {
          options: true,
          quiz: { select: { title: true, category: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  // Group by question (avoid duplicates)
  const uniqueQuestions = this.groupByQuestionId(wrongAnswers);
  
  return uniqueQuestions;
}
```

**Backend Endpoint:**

```typescript
// New endpoints
GET /api/practice/wrong-questions
Response: {
  questions: [
    {
      id: string,
      text: string,
      mistakeCount: number,  // How many times user got it wrong
      lastAttemptDate: Date,
      quiz: { title, category }
    }
  ],
  totalWrong: number
}

POST /api/practice/wrong-questions/start
Body: { questionIds?: string[], count?: number }
Response: { practiceId, questions }
```

**Frontend Page:**

```tsx
// pages/WrongQuestions.tsx
<div>
  <h1>Questions You Got Wrong</h1>
  <p className="text-gray-600">
    Focus on these {wrongCount} questions to improve your score
  </p>
  
  {/* List of wrong questions with mistake count */}
  <div className="space-y-2">
    {wrongQuestions.map(q => (
      <div key={q.id} className="p-4 border rounded">
        <div className="flex justify-between">
          <span>{q.text}</span>
          <span className="text-red-600">
            ✗ {q.mistakeCount} times
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {q.quiz.title} • {q.quiz.category.name}
        </span>
      </div>
    ))}
  </div>
  
  {/* Practice buttons */}
  <div className="mt-4 flex gap-2">
    <button onClick={() => practiceAll()}>
      Practice All ({wrongCount})
    </button>
    <button onClick={() => practiceWorst(10)}>
      Practice Worst 10
    </button>
  </div>
</div>
```

---

### Feature 6: Topic-Based Analytics

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐⭐ High  
**Effort:** 4 days

**Description:**  
Show user performance breakdown by category/topic with visual charts.

**Backend Analytics Service:**

```typescript
// New service: AnalyticsService
async getUserTopicPerformance(userId: string) {
  // Aggregate by category
  const performance = await this.prisma.$queryRaw`
    SELECT 
      c.id as "categoryId",
      c.name as "categoryName",
      COUNT(aa.id) as "totalAnswers",
      SUM(CASE WHEN aa."isCorrect" THEN 1 ELSE 0 END) as "correctAnswers",
      ROUND(
        100.0 * SUM(CASE WHEN aa."isCorrect" THEN 1 ELSE 0 END) / COUNT(aa.id),
        1
      ) as "accuracy"
    FROM attempt_answers aa
    JOIN questions q ON aa."questionId" = q.id
    JOIN quizzes qz ON q."quizId" = qz.id
    JOIN categories c ON qz."categoryId" = c.id
    JOIN quiz_attempts qa ON aa."attemptId" = qa.id
    WHERE qa."userId" = ${userId}
      AND qa.status = 'COMPLETED'
    GROUP BY c.id, c.name
    ORDER BY accuracy ASC
  `;
  
  return performance;
}

async getUserScoreTrend(userId: string, days: number = 30) {
  const scores = await this.prisma.quizAttempt.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    },
    select: {
      completedAt: true,
      score: true,
      totalQuestions: true
    },
    orderBy: { completedAt: 'asc' }
  });
  
  // Calculate percentage scores
  return scores.map(s => ({
    date: s.completedAt,
    score: Math.round((s.score / s.totalQuestions) * 100)
  }));
}
```

**Backend Endpoints:**

```typescript
// GET /api/analytics/me/topics
// GET /api/analytics/me/trend?days=30
// GET /api/analytics/me/summary
```

**Frontend Charts:**

```tsx
// components/TopicPerformanceChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

<BarChart data={topicData}>
  <XAxis dataKey="categoryName" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="accuracy" fill="#3b82f6" />
</BarChart>

// components/ScoreTrendChart.tsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={trendData}>
  <XAxis dataKey="date" tickFormatter={formatDate} />
  <YAxis domain={[0, 100]} />
  <Tooltip />
  <Line 
    type="monotone" 
    dataKey="score" 
    stroke="#10b981" 
    strokeWidth={2}
  />
</LineChart>
```

**Analytics Page:**

```tsx
// pages/Analytics.tsx
<div className="container mx-auto p-4">
  <h1>Your Learning Analytics</h1>
  
  {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatCard
      title="Total Quizzes"
      value={stats.totalQuizzes}
      icon={BookIcon}
    />
    <StatCard
      title="Average Score"
      value={`${stats.avgScore}%`}
      icon={ChartIcon}
    />
    <StatCard
      title="Strongest Topic"
      value={stats.strongestTopic}
      icon={TrophyIcon}
    />
    <StatCard
      title="Weakest Topic"
      value={stats.weakestTopic}
      icon={AlertIcon}
      color="red"
    />
  </div>
  
  {/* Score Trend */}
  <div className="mt-8">
    <h2>Score Trend (Last 30 Days)</h2>
    <ScoreTrendChart data={trendData} />
  </div>
  
  {/* Topic Performance */}
  <div className="mt-8">
    <h2>Performance by Topic</h2>
    <TopicPerformanceChart data={topicData} />
    
    {/* Weak topic alert */}
    {weakestTopic && weakestTopic.accuracy < 60 && (
      <Alert variant="warning">
        <AlertIcon />
        <span>
          Your {weakestTopic.name} accuracy is {weakestTopic.accuracy}%. 
          Consider practicing more in this area.
        </span>
        <button onClick={() => practiceWeakTopic(weakestTopic.id)}>
          Practice Now
        </button>
      </Alert>
    )}
  </div>
</div>
```

---

### Feature 7: Dark Mode

**Priority:** 🔴 MUST HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 3 days

**Description:**  
Full dark mode support with smooth transition and preference persistence.

**Implementation:**

```tsx
// hooks/useDarkMode.ts
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    
    // Otherwise check OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    // Update DOM
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);
  
  return [darkMode, setDarkMode] as const;
};

// components/DarkModeToggle.tsx
export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
```

**Tailwind Configuration:**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Define dark mode colors
        dark: {
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          border: '#404040',
          text: {
            primary: '#ffffff',
            secondary: '#b3b3b3'
          }
        }
      }
    }
  }
};
```

**CSS Classes:**

```css
/* Light mode (default) */
.card {
  @apply bg-white text-gray-900 border-gray-200;
}

/* Dark mode */
.dark .card {
  @apply bg-dark-surface text-dark-text-primary border-dark-border;
}

/* Smooth transition */
* {
  @apply transition-colors duration-200;
}
```

**Components to Update:**
- Navbar
- Sidebar
- Cards
- Buttons
- Forms
- Modals
- Quiz runner

---

### Feature 8: User Preferences

**Priority:** 🟡 SHOULD HAVE  
**Complexity:** ⭐⭐ Medium  
**Effort:** 2 days

**Description:**  
Allow users to customize their experience.

**Database Schema Addition:**

```prisma
model UserPreferences {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  
  // Display preferences
  darkMode          Boolean @default(false)
  fontSize          String  @default("medium") // small, medium, large
  
  // Quiz preferences
  defaultShuffle    Boolean @default(false)
  reviewMode        Boolean @default(false)
  showExplanations  Boolean @default(true)
  
  // Notification preferences
  emailReminders    Boolean @default(false)
  browserNotify     Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Backend Endpoints:**

```typescript
// GET /api/users/me/preferences
// PATCH /api/users/me/preferences
```

**Frontend Preferences Page:**

```tsx
// pages/Preferences.tsx
<div className="max-w-2xl mx-auto p-4">
  <h1>Preferences</h1>
  
  {/* Display */}
  <section>
    <h2>Display</h2>
    <Setting
      label="Dark Mode"
      type="toggle"
      value={prefs.darkMode}
      onChange={(v) => updatePref('darkMode', v)}
    />
    <Setting
      label="Font Size"
      type="select"
      options={['Small', 'Medium', 'Large']}
      value={prefs.fontSize}
      onChange={(v) => updatePref('fontSize', v)}
    />
  </section>
  
  {/* Quiz Defaults */}
  <section>
    <h2>Quiz Defaults</h2>
    <Setting
      label="Always shuffle questions"
      type="toggle"
      value={prefs.defaultShuffle}
    />
    <Setting
      label="Enable review mode by default"
      type="toggle"
      value={prefs.reviewMode}
    />
  </section>
  
  {/* Notifications */}
  <section>
    <h2>Notifications</h2>
    <Setting
      label="Email reminders"
      type="toggle"
      value={prefs.emailReminders}
    />
    <Setting
      label="Browser notifications"
      type="toggle"
      value={prefs.browserNotify}
    />
  </section>
</div>
```

---

## 🔧 TECHNICAL TASKS

### Backend Tasks

#### Task 2.1: Practice Modes Service (5 days)

**Files to Create:**
```
backend/src/practice/
├── practice.module.ts
├── practice.service.ts
├── practice.controller.ts
└── dto/
    ├── quick-practice.dto.ts
    └── practice-result.dto.ts
```

**Implementation:**
```typescript
// practice.service.ts
@Injectable()
export class PracticeService {
  async createQuickPractice(dto: QuickPracticeDto, userId: string) {
    // Generate random question set
    // Return practice session ID
  }
  
  async getBookmarkedPractice(userId: string, count?: number) {
    // Get user's bookmarked questions
  }
  
  async getWrongQuestions(userId: string) {
    // Get questions user answered incorrectly
  }
  
  async submitPractice(practiceId: string, answers: Answer[]) {
    // Grade practice session
    // Return results
  }
}
```

---

#### Task 2.2: Analytics Service (4 days)

**Files to Create:**
```
backend/src/analytics/
├── analytics.module.ts
├── analytics.service.ts
├── analytics.controller.ts
└── dto/
    ├── topic-performance.dto.ts
    └── score-trend.dto.ts
```

**Queries to Implement:**
- User topic performance (accuracy by category)
- Score trend over time
- Weekly/monthly summaries
- Weakest topic identification

---

#### Task 2.3: Shuffle Logic (1 day)

**Modify Existing:**
```
backend/src/questions/questions.service.ts
```

**Add Methods:**
```typescript
shuffleQuestions(questions: Question[]): Question[]
shuffleOptions(question: Question): Question
```

---

### Frontend Tasks

#### Task 2.4: Practice Mode Pages (5 days)

**Files to Create:**
```
frontend/src/pages/practice/
├── QuickPractice.tsx
├── QuickPracticeConfig.tsx
├── BookmarkedPractice.tsx
├── WrongQuestions.tsx
└── PracticeResult.tsx
```

---

#### Task 2.5: Analytics Dashboard (4 days)

**Files to Create:**
```
frontend/src/pages/Analytics.tsx
frontend/src/components/charts/
├── TopicPerformanceChart.tsx
├── ScoreTrendChart.tsx
└── StatCard.tsx
```

**Dependencies:**
```bash
npm install recharts
npm install date-fns  # For date formatting
```

---

#### Task 2.6: Dark Mode Implementation (3 days)

**Files to Create:**
```
frontend/src/hooks/useDarkMode.ts
frontend/src/components/DarkModeToggle.tsx
```

**Files to Modify:**
- tailwind.config.js
- All component CSS classes
- index.css (dark mode base styles)

---

#### Task 2.7: Review Mode (2 days)

**Files to Modify:**
```
frontend/src/pages/QuizRunner.tsx
frontend/src/components/QuestionDisplay.tsx
```

**Add Components:**
```
frontend/src/components/FeedbackPanel.tsx
```

---

### Database Tasks

#### Task 2.8: User Preferences Schema (1 day)

**Migration:**
```prisma
model UserPreferences {
  id                String   @id @default(uuid())
  userId            String   @unique
  darkMode          Boolean  @default(false)
  fontSize          String   @default("medium")
  defaultShuffle    Boolean  @default(false)
  reviewMode        Boolean  @default(false)
  showExplanations  Boolean  @default(true)
  emailReminders    Boolean  @default(false)
  browserNotify     Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Run Migration:**
```bash
npx prisma migrate dev --name add_user_preferences
```

---

## 💾 DATABASE CHANGES

### New Table: UserPreferences

```sql
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "defaultShuffle" BOOLEAN NOT NULL DEFAULT false,
    "reviewMode" BOOLEAN NOT NULL DEFAULT false,
    "showExplanations" BOOLEAN NOT NULL DEFAULT true,
    "emailReminders" BOOLEAN NOT NULL DEFAULT false,
    "browserNotify" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "user_preferences_userId_fkey" 
    FOREIGN KEY ("userId") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE
);

CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");
```

### Indexes (Already Exist)

No new indexes needed. Existing indexes sufficient for analytics queries.

---

## ✅ ACCEPTANCE CRITERIA

### Functional Criteria

- [ ] **Quick Practice**
  - Can select 5/10/15/20 questions
  - Questions randomized from all quizzes
  - Category filter works
  - Results show breakdown by topic
  - "Practice Again" generates new set

- [ ] **Review Mode**
  - Toggle switch visible and functional
  - Instant feedback after each answer
  - Shows correct/wrong indicator
  - Displays explanation (if available)
  - Can proceed to next question

- [ ] **Shuffle**
  - Questions appear in random order
  - Options (A/B/C/D) randomized
  - Same quiz shuffles differently each time
  - Preference saved

- [ ] **Practice Bookmarked**
  - Shows count of bookmarked questions
  - Can practice all or subset
  - Questions display correctly

- [ ] **Practice Wrong Questions**
  - Lists all previously wrong questions
  - Shows mistake count per question
  - Can practice all wrong questions
  - Can practice worst 10

- [ ] **Topic Analytics**
  - Bar chart shows accuracy by topic
  - Line chart shows score trend
  - Weakest topic identified
  - One-click practice for weak topic

- [ ] **Dark Mode**
  - Toggle button in navbar
  - Smooth transition (no flash)
  - All pages styled for dark mode
  - Preference persisted
  - Auto-detect OS preference (optional)

### Performance Criteria

- [ ] Analytics page loads in < 2s
- [ ] Charts render smoothly (60fps)
- [ ] Dark mode toggle instant (<100ms)
- [ ] Practice mode starts in < 500ms

### UX Criteria

- [ ] All new features mobile-responsive
- [ ] Loading states for async operations
- [ ] Error handling with user-friendly messages
- [ ] Empty states (no bookmarks, no wrong questions)
- [ ] Accessibility (keyboard navigation, ARIA labels)

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Analytics Queries Slow

**Probability:** Medium  
**Impact:** High

**Mitigation:**
- [ ] Use Phase 1's caching (cache analytics for 15 minutes)
- [ ] Pre-calculate common aggregations
- [ ] Use database materialized views for heavy queries
- [ ] Add indexes on `attemptId`, `userId`, `completedAt`

---

### Risk 2: Dark Mode Breaks UI

**Probability:** Low  
**Impact:** Medium

**Mitigation:**
- [ ] Test on all major pages before release
- [ ] Provide "Report Issue" button
- [ ] Easy toggle to disable
- [ ] Fallback to light mode on errors

---

### Risk 3: Chart Library Performance

**Probability:** Low  
**Impact:** Medium

**Mitigation:**
- [ ] Limit data points (last 30 days only)
- [ ] Use SVG charts (better performance than Canvas)
- [ ] Lazy load chart components
- [ ] Add loading skeletons

---

## 📅 TIMELINE

### Week 1: Practice Modes Backend

**Days 1-3: Quick Practice**
- Implement PracticeService
- Create endpoints
- Write tests

**Days 4-5: Bookmarked & Wrong Questions**
- Implement logic
- Create endpoints
- Write tests

---

### Week 2: Analytics & Shuffle

**Days 1-3: Analytics Service**
- Topic performance query
- Score trend query
- Summary stats
- Endpoints

**Days 4: Shuffle Logic**
- Implement shuffle methods
- Update quiz endpoints
- Test randomness

**Day 5: Review Mode Backend**
- No new backend needed
- Documentation only

---

### Week 3: Frontend Features

**Days 1-2: Practice Mode UI**
- Quick Practice page
- Configuration screen
- Result screen

**Days 3-4: Analytics Dashboard**
- Install Recharts
- Create chart components
- Build analytics page

**Day 5: Dark Mode**
- Implement useDarkMode hook
- Add toggle button
- Update base styles

---

### Week 4: Polish & Testing

**Days 1-2: Dark Mode Rollout**
- Style all components for dark mode
- Test transitions
- Fix any issues

**Days 3-4: Testing**
- Full regression testing
- Mobile testing
- Accessibility testing
- Performance testing

**Day 5: Documentation & Deploy**
- Update user guide
- Create video tutorials
- Deploy to production
- Monitor feedback

---

## 📦 DELIVERABLES

### Code Deliverables

```
backend/src/
├── practice/
│   ├── practice.module.ts
│   ├── practice.service.ts
│   └── practice.controller.ts
├── analytics/
│   ├── analytics.module.ts
│   ├── analytics.service.ts
│   └── analytics.controller.ts

frontend/src/
├── pages/
│   ├── practice/
│   │   ├── QuickPractice.tsx
│   │   ├── BookmarkedPractice.tsx
│   │   └── WrongQuestions.tsx
│   └── Analytics.tsx
├── components/
│   ├── charts/
│   │   ├── TopicPerformanceChart.tsx
│   │   └── ScoreTrendChart.tsx
│   ├── DarkModeToggle.tsx
│   └── FeedbackPanel.tsx
└── hooks/
    └── useDarkMode.ts
```

---

### Documentation Deliverables

- [ ] **User Guide Update** - New features tutorial
- [ ] **Dark Mode Guide** - How to use dark mode
- [ ] **Analytics Explainer** - Understanding your stats
- [ ] **Practice Modes Guide** - Different practice options

---

## 🏁 DEFINITION OF DONE

Phase 2 is **COMPLETE** when:

- [ ] All 8 features implemented and tested
- [ ] Dark mode works on all pages
- [ ] Analytics charts render correctly
- [ ] Practice modes functional
- [ ] User engagement increased by 30%
- [ ] Zero critical bugs
- [ ] Documentation complete
- [ ] User feedback collected (>4.0 satisfaction)
- [ ] Retrospective completed

---

**Prepared by:** Development Team  
**Approved by:** Product Owner  
**Depends on:** Phase 1 (Redis caching)  
**Start Date:** TBD  
**Target Completion:** TBD + 3-4 weeks  
**Status:** Ready After Phase 1 🟡
