# Phase 2: Enhanced User Experience

## 📋 Summary

**Duration:** 4-5 weeks  
**Team Size:** 2-3 Full-stack Engineers + 1 UI/UX Designer  
**Priority:** 🔴 HIGH  
**Status:** Ready for implementation (after Phase 1)

Transform QuizMaster into an engaging, flexible learning platform that increases user engagement by 50% through personalized practice modes, smart analytics, and user-friendly customization options.

---

## 🎯 Objective

**Primary Goal:**  
Dramatically improve user engagement and learning effectiveness through flexible practice modes, instant feedback, personalized analytics, and modern UX enhancements.

**Success Metrics:**
- Daily active users: +50%
- User session time: +30%
- Quiz completion rate: +25%
- User retention (30-day): +40%
- User satisfaction score: >4.5/5
- Practice mode adoption: >60% of users

**Why Phase 2:**
- 💪 Phase 1 provides stable foundation
- 🎯 Addresses core user pain points (time, flexibility, motivation)
- 📊 Creates data for future personalization (Phase 4-5)
- 🚀 High ROI: direct impact on user engagement

---

## 📦 Scope

### ✅ In Scope

**Practice Modes:**
1. Quick Practice Mode (5/10/15/20 random questions)
2. Review Mode (instant feedback after each answer)
3. Practice Bookmarked Questions
4. Practice Wrong Questions (mistake review)
5. **Flexible Quiz Configuration** (NEW - custom question count, shuffle options)

**Analytics & Personalization:**
6. Topic-Based Analytics (performance by category)
7. Score Trend Visualization

**UX Enhancements:**
8. Dark Mode (system-wide theme)
9. User Preferences (centralized settings)

### ❌ Out of Scope

- Admin tools (Phase 3)
- Achievements/Gamification (Phase 4)
- AI features (Phase 5)
- Real-time multiplayer (Phase 5)
- Mobile app (future)

---

## 👥 User Stories

### US-01: Quick Practice for Busy Users
```
As a busy student with only 15 minutes,
I want to practice 10 random questions,
So that I can use my time efficiently.

Current: Must complete full 50-question quiz
Target: Choose 10/20 questions in 1 click
Acceptance: 40% of users use Quick Practice
```

### US-02: Flexible Quiz Configuration
```
As a user who wants control over my practice,
I want to choose how many questions to answer and whether to shuffle them,
So that I can customize my learning experience.

Current: Fixed quiz length, no customization
Target: Slider to choose 5-50 questions, shuffle toggles
Acceptance: 30% of users customize quiz settings
```

### US-03: Instant Feedback for Active Learning
```
As a learner who benefits from immediate correction,
I want to see if my answer is right/wrong instantly,
So that I can learn as I practice.

Current: Feedback only after completing full quiz
Target: Toggle to enable instant feedback per question
Acceptance: 50% of users enable Review Mode
```

### US-04: Shuffle to Prevent Pattern Memorization
```
As a user who has taken quizzes multiple times,
I want questions and options in random order,
So that I test real knowledge, not memory patterns.

Current: Fixed question order
Target: Default shuffle, option to disable
Acceptance: 80% completion with shuffle enabled
```

### US-05: Practice Mistakes
```
As a user who made mistakes,
I want to practice only questions I got wrong,
So that I can focus on weak areas.

Current: Must retake full quiz to review mistakes
Target: "Practice Wrong Questions" button
Acceptance: 35% of users retry wrong questions
```

### US-06: Practice Saved Questions
```
As a user who bookmarked interesting questions,
I want to practice only my bookmarks,
So that I can review important content.

Current: Bookmarks only visible in list
Target: "Practice Bookmarked" generates quiz
Acceptance: 25% of users practice bookmarks
```

### US-07: Topic Performance Insights
```
As a user tracking my progress,
I want to see accuracy % by topic,
So that I know which areas need improvement.

Current: Only overall score visible
Target: Bar chart showing topic performance
Acceptance: 60% of users view analytics
```

### US-08: Dark Mode for Comfort
```
As a user who studies at night,
I want a dark theme,
So that I can reduce eye strain.

Current: Light mode only
Target: Toggle button in navbar, persistent
Acceptance: 35% of users enable dark mode
```

### US-09: Save My Preferences
```
As a regular user,
I want my settings remembered,
So that I don't reconfigure each time.

Current: Settings reset every session
Target: Preferences saved to account
Acceptance: 70% of users save preferences
```

---

## 🎨 Feature Breakdown

### Feature 2.1: Quick Practice Mode ⭐⭐⭐⭐⭐

**Objective:** Enable time-efficient practice with random question subsets

**User Flow:**
```
Dashboard
  → "Quick Practice" button
    → Select question count (preset or custom)
      → Optional: Filter by category, difficulty
        → Start practice
          → Complete & view results
```

**Configuration Options:**

| Option | Values | Default |
|--------|--------|---------|
| Question count | 5, 10, 15, 20, Custom | 10 |
| Category filter | All, JavaScript, React, etc. | All |
| Difficulty | All, Easy, Medium, Hard | All |
| Timed | Yes, No | No |

**Backend API:**

```typescript
// GET /api/practice/quick?count=10&categoryId=xxx&difficulty=MEDIUM
{
  questions: Question[],
  totalAvailable: number,
  practiceId: string  // New practice attempt
}

// POST /api/practice/:id/submit
{
  practiceId: string,
  answers: Answer[]
}
// Response
{
  score: number,
  totalQuestions: number,
  breakdown: {
    [category: string]: {
      correct: number,
      total: number
    }
  }
}
```

**Implementation Complexity:** ⭐⭐⭐⭐ High (5 days)
- Backend: 3 days (service, controller, logic)
- Frontend: 2 days (UI, flow)

---

### Feature 2.2: Review Mode (Instant Feedback) ⭐⭐⭐⭐

**Objective:** Enable active learning with immediate answer feedback

**User Flow:**
```
Quiz Config
  → Enable "Review Mode" toggle
    → Answer question
      → [INSTANT] Green/Red indicator appears
        → Explanation shown (if available)
          → Wait 2s OR click "Next"
            → Proceed to next question
```

**UI States:**

```
┌─────────────────────────────────────┐
│ Question 5 of 10                    │
├─────────────────────────────────────┤
│ What is React?                      │
│                                     │
│ ✓ A) A JavaScript library     ← Correct!
│ ✗ B) A programming language         │
│   C) A database                     │
│   D) An operating system            │
│                                     │
│ 💡 Explanation:                     │
│ React is a JavaScript library for   │
│ building user interfaces...         │
│                                     │
│              [Next Question]         │
└─────────────────────────────────────┘
```

**Technical Implementation:**
- Frontend-only logic (no new backend API)
- State management for review mode
- Answer validation on selection
- 2-second delay or manual proceed

**Implementation Complexity:** ⭐⭐⭐ Medium (3 days)
- Frontend: 3 days (state, UI, animations)

---

### Feature 2.3: Shuffle Questions & Options ⭐⭐⭐⭐

**Objective:** Prevent pattern memorization through randomization

**Shuffle Types:**

1. **Shuffle Questions:** Randomize question order
2. **Shuffle Options:** Randomize A/B/C/D order

**Configuration:**

| Setting | Options | Default | Storage |
|---------|---------|---------|---------|
| Shuffle questions | ON/OFF | ON | User preference |
| Shuffle options | ON/OFF | OFF | User preference |

**Backend Implementation:**

```typescript
// In QuestionsService
async getShuffledQuestions(quizId: string, shuffleConfig: ShuffleConfig) {
  let questions = await this.prisma.question.findMany({
    where: { quizId },
    include: { options: true }
  });

  if (shuffleConfig.shuffleQuestions) {
    questions = this.shuffle(questions);
  }

  if (shuffleConfig.shuffleOptions) {
    questions = questions.map(q => ({
      ...q,
      options: this.shuffle(q.options)
    }));
  }

  return questions;
}

private shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

**Caching Strategy:**
```typescript
// Cache multiple shuffled versions
const cacheKey = `quiz:${quizId}:shuffled:${seed}`;
// Pre-generate 10 shuffled versions
// Rotate through cached versions
```

**Implementation Complexity:** ⭐⭐ Easy (2 days)
- Backend: 1 day (shuffle logic)
- Frontend: 1 day (toggle UI)

---

### Feature 2.4: Practice Bookmarked Questions ⭐⭐⭐

**Objective:** Enable targeted practice of saved questions

**User Flow:**
```
Profile / Bookmarks page
  → View bookmarked questions (count: 23)
    → "Practice Bookmarks" button
      → Select: All OR Random 10
        → Start practice
          → Results + update bookmark status
```

**Backend API:**

```typescript
// GET /api/practice/bookmarked?count=10
{
  questions: Question[],
  total: number
}

// Remove from bookmarks option
// POST /api/practice/bookmarked/:questionId/unbookmark
```

**UI Components:**
```tsx
<BookmarksPage>
  <BookmarksList questions={bookmarks} />
  <PracticeButton 
    onClick={startPractice}
    count={bookmarks.length}
  />
</BookmarksPage>
```

**Implementation Complexity:** ⭐⭐ Easy (2 days)
- Backend: 1 day (query bookmarked questions)
- Frontend: 1 day (UI, flow)

---

### Feature 2.5: Practice Wrong Questions ⭐⭐⭐⭐

**Objective:** Focus practice on mistakes for faster improvement

**User Flow:**
```
Profile / History page
  → View "Questions You Got Wrong" (count: 15)
    → Sort by: Most mistakes, Recent
      → "Practice Wrong Questions" button
        → Select: All OR Worst 10
          → Start practice
            → Track if corrected
```

**Data Structure:**

```typescript
// Track wrong answers
interface WrongAnswer {
  questionId: string;
  attemptedCount: number;  // How many times tried
  wrongCount: number;      // How many times wrong
  lastAttempt: Date;
  correctOnRetry: boolean;
}
```

**Backend API:**

```typescript
// GET /api/practice/wrong-questions
{
  questions: Array<{
    question: Question,
    metadata: {
      wrongCount: number,
      lastAttempt: Date,
      correctOnRetry: boolean
    }
  }>
}

// POST /api/practice/wrong-questions/start?count=10
// Creates practice session with wrong questions
```

**UI - Wrong Questions List:**
```tsx
<WrongQuestionsList>
  {wrongQuestions.map(item => (
    <WrongQuestionCard
      question={item.question}
      wrongCount={item.metadata.wrongCount}
      lastAttempt={item.metadata.lastAttempt}
    />
  ))}
  <PracticeButton
    label={`Practice ${wrongQuestions.length} Questions`}
    onClick={startPractice}
  />
</WrongQuestionsList>
```

**Implementation Complexity:** ⭐⭐⭐ Medium (3 days)
- Backend: 2 days (complex SQL, aggregation)
- Frontend: 1 day (UI)

---

### Feature 2.6: Topic-Based Analytics ⭐⭐⭐⭐⭐

**Objective:** Provide insights into performance by topic/category

**Analytics Dashboard:**

```
┌─────────────────────────────────────────┐
│ Your Performance by Topic               │
├─────────────────────────────────────────┤
│                                         │
│ JavaScript    ████████░░ 80%           │
│ React         ███████░░░ 70%           │
│ Node.js       █████░░░░ 50%  ← Weak!  │
│ CSS           █████████░ 90%           │
│                                         │
│ 💡 Recommendation:                      │
│ Practice more Node.js questions         │
│ [Start Practice] (15 questions)         │
│                                         │
│ Score Trend (Last 30 Days)             │
│ 100% ┤         ╭─╮                     │
│  75% ┤    ╭────╯ ╰─╮                   │
│  50% ┤ ╭──╯         ╰─╮                │
│  25% ┤─╯              ╰─               │
│       └─────────────────────            │
│                                         │
└─────────────────────────────────────────┘
```

**Backend SQL:**

```typescript
// Get topic performance
async getUserTopicPerformance(userId: string) {
  const results = await this.prisma.$queryRaw`
    SELECT 
      c.name as topic,
      COUNT(*) as total_attempts,
      SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct_count,
      ROUND(
        100.0 * SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) / COUNT(*),
        2
      ) as accuracy_percent
    FROM user_answers ua
    JOIN questions q ON ua.question_id = q.id
    JOIN quizzes qz ON q.quiz_id = qz.id
    JOIN categories c ON qz.category_id = c.id
    WHERE ua.user_id = ${userId}
    GROUP BY c.id, c.name
    ORDER BY accuracy_percent ASC
  `;
  
  return results;
}

// Get score trend
async getUserScoreTrend(userId: string, days: number = 30) {
  const results = await this.prisma.quizAttempt.findMany({
    where: {
      userId,
      completedAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      },
      status: 'COMPLETED'
    },
    select: {
      completedAt: true,
      score: true,
      totalQuestions: true
    },
    orderBy: { completedAt: 'asc' }
  });

  return results.map(r => ({
    date: r.completedAt,
    percentage: (r.score / r.totalQuestions) * 100
  }));
}
```

**Frontend Charts:**

```tsx
// Using Recharts library
import { BarChart, LineChart, Bar, Line, XAxis, YAxis } from 'recharts';

<BarChart data={topicPerformance}>
  <XAxis dataKey="topic" />
  <YAxis />
  <Bar dataKey="accuracy_percent" fill="#8884d8" />
</BarChart>

<LineChart data={scoreTrend}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line type="monotone" dataKey="percentage" stroke="#82ca9d" />
</LineChart>
```

**Implementation Complexity:** ⭐⭐⭐⭐ High (4 days)
- Backend: 2 days (complex SQL, aggregations)
- Frontend: 2 days (charts, dashboard)

---

### Feature 2.7: Dark Mode ⭐⭐⭐⭐

**Objective:** Modern UX with theme switching for eye comfort

**Implementation Strategy:**

1. **CSS Variables Approach:**

```css
/* light-theme.css */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
}

/* dark-theme.css */
[data-theme='dark'] {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #374151;
  --accent-color: #60a5fa;
}
```

2. **Tailwind Dark Mode:**

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors
      }
    }
  }
}
```

3. **React Hook:**

```typescript
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Load from localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  return { isDark, toggleDarkMode: () => setIsDark(!isDark) };
};
```

4. **Toggle Button:**

```tsx
<button
  onClick={toggleDarkMode}
  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
>
  {isDark ? <Sun size={20} /> : <Moon size={20} />}
</button>
```

**Update All Components:**
- Replace hardcoded colors with CSS variables or Tailwind classes
- Test all pages in both modes
- Ensure proper contrast ratios (WCAG AA)

**Implementation Complexity:** ⭐⭐⭐ Medium (3 days)
- Setup: 1 day (config, CSS variables)
- Component updates: 2 days (update all components)

---

### Feature 2.8: User Preferences ⭐⭐⭐

**Objective:** Centralized settings for personalized experience

**Database Schema:**

```prisma
model UserPreferences {
  id              String  @id @default(uuid())
  userId          String  @unique
  
  // Appearance
  darkMode        Boolean @default(false)
  fontSize        String  @default("medium")  // small, medium, large
  
  // Quiz defaults
  defaultShuffle  Boolean @default(true)
  reviewMode      Boolean @default(false)
  showExplanations Boolean @default(true)
  
  // NEW: Quiz configuration defaults
  defaultQuestionCount Int?  @default(null)  // null = full quiz
  defaultShuffleQuestions Boolean @default(true)
  defaultShuffleOptions Boolean @default(false)
  
  // Notifications
  emailReminders  Boolean @default(true)
  browserNotify   Boolean @default(false)
  
  user            User    @relation(fields: [userId], references: [id])
}
```

**Backend API:**

```typescript
// GET /api/users/me/preferences
{
  darkMode: false,
  fontSize: "medium",
  defaultShuffle: true,
  reviewMode: false,
  showExplanations: true,
  defaultQuestionCount: 20,
  defaultShuffleQuestions: true,
  defaultShuffleOptions: false,
  emailReminders: true,
  browserNotify: false
}

// PATCH /api/users/me/preferences
{
  darkMode: true,
  fontSize: "large"
}
```

**Frontend - Preferences Page:**

```tsx
<PreferencesPage>
  <Section title="Appearance">
    <Toggle label="Dark Mode" value={darkMode} onChange={...} />
    <Select label="Font Size" options={['small', 'medium', 'large']} />
  </Section>

  <Section title="Quiz Defaults">
    <Toggle label="Shuffle Questions" value={defaultShuffle} />
    <Toggle label="Review Mode" value={reviewMode} />
    <Toggle label="Show Explanations" value={showExplanations} />
    <Slider 
      label="Default Question Count"
      min={5}
      max={50}
      value={defaultQuestionCount}
    />
  </Section>

  <Section title="Notifications">
    <Toggle label="Email Reminders" value={emailReminders} />
    <Toggle label="Browser Notifications" value={browserNotify} />
  </Section>

  <Button onClick={savePreferences}>Save Preferences</Button>
</PreferencesPage>
```

**Implementation Complexity:** ⭐⭐ Easy (2 days)
- Backend: 1 day (CRUD endpoints)
- Frontend: 1 day (preferences UI)

---

### Feature 2.9: Flexible Quiz Configuration ⭐⭐⭐⭐⭐ (NEW)

**Objective:** Give users full control over quiz experience with customizable question count and shuffle options

**User Flow:**
```
Quiz Detail Page
  → Click "Start Quiz"
    → Configuration Modal appears
      → Quick Presets: [Quick 10q] [Medium 20q] [Full 50q]
        → OR Custom Slider: 5 ────●──── 50 questions
          → Shuffle Options:
            ☑ Shuffle question order
            ☐ Shuffle answer options (A/B/C/D)
          → [Remember settings]
            → Click "Start Quiz"
              → Quiz runs with selected config
```

**Configuration Modal UI:**

```
┌─────────────────────────────────────────────┐
│ Configure Your Quiz                         │
├─────────────────────────────────────────────┤
│                                             │
│ Number of Questions:                        │
│ ┌─────────────────────────────────────────┐│
│ │ ⚡ Quick   │ 📚 Medium  │ 🎯 Full       ││
│ │ 10 questions│ 20 questions│ 50 questions ││
│ │   ~8 min   │   ~15 min   │   ~40 min    ││
│ └─────────────────────────────────────────┘│
│                                             │
│ Or choose custom:                           │
│ 5 ████████████████████░░░░░ 50             │
│ 25 questions (~20 minutes)                  │
│                                             │
│ Shuffle Options:                            │
│ ☑ Shuffle question order                   │
│   Randomize question sequence each time     │
│                                             │
│ ☐ Shuffle answer options (A/B/C/D)         │
│   Randomize option order within questions   │
│                                             │
│ ☐ Remember my settings for next time       │
│                                             │
│           [Cancel]  [Start Quiz]            │
└─────────────────────────────────────────────┘
```

**Backend API:**

```typescript
// POST /api/attempts/start
{
  quizId: string,
  config: {
    questionCount: number | null,    // null = all questions
    shuffleQuestions: boolean,       // default: true
    shuffleOptions: boolean          // default: false
  }
}

// Response
{
  attemptId: string,
  quiz: Quiz,
  questions: Question[],  // Already shuffled and limited
  config: QuizConfig,     // Echo back config used
  metadata: {
    totalAvailable: number,
    selected: number,
    estimatedTime: number  // minutes
  }
}
```

**Database Changes:**

```prisma
model QuizAttempt {
  // ... existing fields
  
  // NEW FIELDS
  configSnapshot Json?     // Store config used for this attempt
  selectedQuestions String[] // Array of questionIds (in order shown)
  
  // Example configSnapshot:
  // {
  //   "questionCount": 20,
  //   "shuffleQuestions": true,
  //   "shuffleOptions": false,
  //   "totalAvailable": 50
  // }
}
```

**Key Features:**

1. **Quick Presets:**
   - Quick (10 questions, ~8 min)
   - Medium (20 questions, ~15 min)
   - Full (all questions, ~40 min)

2. **Custom Selection:**
   - Slider: 5 to max questions
   - Real-time time estimate
   - Visual feedback

3. **Shuffle Control:**
   - Shuffle questions: ON by default
   - Shuffle options: OFF by default (preserve order)
   - Tooltips explain each option

4. **Preference Storage:**
   - Checkbox: "Remember my settings"
   - Auto-populate on next quiz
   - Stored in UserPreferences table

**Technical Implementation:**

```typescript
// Backend: AttemptsService
async startAttempt(dto: StartAttemptDto, userId: string) {
  // 1. Load user preferences if no config provided
  const config = dto.config || await this.getUserDefaultConfig(userId);
  
  // 2. Get questions with config applied
  const questions = await this.questionsService.getQuestionsWithConfig(
    dto.quizId,
    config
  );
  
  // 3. Create attempt with config snapshot
  const attempt = await this.prisma.quizAttempt.create({
    data: {
      userId,
      quizId: dto.quizId,
      configSnapshot: config,
      selectedQuestions: questions.map(q => q.id),
      startedAt: new Date()
    }
  });
  
  return {
    attemptId: attempt.id,
    questions,
    config,
    metadata: {
      totalAvailable: await this.getTotalQuestions(dto.quizId),
      selected: questions.length,
      estimatedTime: this.calculateEstimatedTime(questions.length)
    }
  };
}

// Frontend: useQuizConfig hook
const useQuizConfig = () => {
  const loadSavedConfig = (): QuizConfig => {
    const saved = localStorage.getItem('quizConfig');
    return saved ? JSON.parse(saved) : {
      questionCount: null,
      shuffleQuestions: true,
      shuffleOptions: false
    };
  };
  
  const saveConfig = (config: QuizConfig) => {
    localStorage.setItem('quizConfig', JSON.stringify(config));
  };
  
  return { loadSavedConfig, saveConfig };
};
```

**Security Considerations:**

```typescript
// Validation
if (config.questionCount !== null) {
  if (config.questionCount < 5) {
    throw new BadRequestException('Minimum 5 questions required');
  }
  if (config.questionCount > totalQuestions) {
    throw new BadRequestException('Cannot exceed total questions');
  }
}

// Rate limiting
@Throttle({ default: { limit: 10, ttl: 60000 } })
async startAttempt() {}

// Server-side randomization (not client choice)
questions = this.selectRandom(allQuestions, config.questionCount);
```

**Leaderboard Fairness:**

```typescript
// Option 1: Separate leaderboards
if (config.questionCount !== totalQuestions) {
  attempt.leaderboardCategory = 'PRACTICE';
} else {
  attempt.leaderboardCategory = 'FULL';
}

// Option 2: Require full quiz for leaderboard
if (config.questionCount !== null) {
  attempt.eligibleForLeaderboard = false;
}
```

**Implementation Complexity:** ⭐⭐⭐⭐ High (6 days)
- Backend: 3 days (service logic, validation, config storage)
- Frontend: 3 days (modal UI, slider, presets, integration)

**Benefits:**
- ✅ Addresses time constraint pain point
- ✅ Increases flexibility and user control
- ✅ Prevents pattern memorization
- ✅ High user value (requested feature)
- ✅ Builds on Phase 1 shuffle logic
- ✅ Enables future personalization (Phase 4-5)

---

## 🔧 Technical Tasks

### Backend (NestJS) - 15 days

#### Task 2.1: Practice Service (5 days)

**Files to create:**
```
backend/src/
├── practice/
│   ├── practice.module.ts
│   ├── practice.service.ts
│   ├── practice.controller.ts
│   └── dto/
│       ├── quick-practice.dto.ts
│       ├── bookmarked-practice.dto.ts
│       └── wrong-questions.dto.ts
```

**Implementation:**

```typescript
@Injectable()
export class PracticeService {
  // Quick practice
  async createQuickPractice(
    userId: string,
    count: number,
    filters: PracticeFilters
  ): Promise<PracticeSession> {
    const questions = await this.getRandomQuestions(count, filters);
    return this.createPracticeSession(userId, questions, 'QUICK');
  }

  // Bookmarked practice
  async createBookmarkedPractice(
    userId: string,
    count?: number
  ): Promise<PracticeSession> {
    const bookmarks = await this.getUserBookmarks(userId);
    const questions = count ? 
      this.selectRandom(bookmarks, count) : 
      bookmarks;
    return this.createPracticeSession(userId, questions, 'BOOKMARKED');
  }

  // Wrong questions practice
  async createWrongQuestionsPractice(
    userId: string,
    count?: number
  ): Promise<PracticeSession> {
    const wrongQuestions = await this.getWrongQuestions(userId);
    const questions = count ?
      this.selectWorst(wrongQuestions, count) :
      wrongQuestions;
    return this.createPracticeSession(userId, questions, 'WRONG');
  }

  private async createPracticeSession(
    userId: string,
    questions: Question[],
    type: PracticeType
  ): Promise<PracticeSession> {
    return this.prisma.practiceSession.create({
      data: {
        userId,
        type,
        questions: {
          connect: questions.map(q => ({ id: q.id }))
        }
      }
    });
  }
}
```

**Testing:**
- Unit tests for each practice type
- Integration tests for database queries
- Performance tests (query optimization)

---

#### Task 2.2: Analytics Service (4 days)

**Files to create:**
```
backend/src/
├── analytics/
│   ├── analytics.module.ts
│   ├── analytics.service.ts
│   └── analytics.controller.ts
```

**Implementation:**

```typescript
@Injectable()
export class AnalyticsService {
  async getUserTopicPerformance(userId: string) {
    return this.prisma.$queryRaw`
      SELECT 
        c.name as topic,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct,
        ROUND(
          100.0 * SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) / COUNT(*),
          2
        ) as accuracy
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.id
      JOIN quizzes qz ON q.quiz_id = qz.id
      JOIN categories c ON qz.category_id = c.id
      WHERE ua.user_id = ${userId}
      GROUP BY c.id, c.name
      ORDER BY accuracy ASC
    `;
  }

  async getUserScoreTrend(userId: string, days: number = 30) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: { gte: cutoff },
        status: 'COMPLETED'
      },
      select: {
        completedAt: true,
        score: true,
        totalQuestions: true
      },
      orderBy: { completedAt: 'asc' }
    });

    return attempts.map(a => ({
      date: a.completedAt,
      percentage: (a.score / a.totalQuestions) * 100
    }));
  }

  async getWeakestTopics(userId: string, limit: number = 3) {
    const performance = await this.getUserTopicPerformance(userId);
    return performance
      .filter(p => p.total_attempts >= 5)  // Minimum sample size
      .slice(0, limit);
  }
}
```

**Optimization:**
- Add database indexes for user_answers queries
- Cache analytics results (5-15 minutes)
- Batch calculations for multiple users

**Testing:**
- Test SQL query correctness
- Test edge cases (no attempts, single topic)
- Load test with large datasets

---

#### Task 2.3: Shuffle Logic Enhancement (1 day)

**Files to modify:**
```
backend/src/questions/questions.service.ts
```

**Implementation:**

```typescript
async getQuestionsWithShuffle(
  quizId: string,
  shuffleConfig: ShuffleConfig
): Promise<Question[]> {
  let questions = await this.prisma.question.findMany({
    where: { quizId },
    include: { options: true },
    orderBy: { order: 'asc' }
  });

  if (shuffleConfig.shuffleQuestions) {
    questions = this.shuffle(questions);
  }

  if (shuffleConfig.shuffleOptions) {
    questions = questions.map(q => ({
      ...q,
      options: this.shuffle(q.options)
    }));
  }

  return questions;
}

private shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

**Caching Strategy:**
```typescript
// Pre-generate shuffled versions
const cacheKey = `quiz:${quizId}:shuffled:${seed}`;
if (await this.cacheService.has(cacheKey)) {
  return this.cacheService.get(cacheKey);
}
// Generate and cache
const shuffled = this.shuffle(questions);
await this.cacheService.set(cacheKey, shuffled, 3600);
return shuffled;
```

---

#### Task 2.4: Flexible Quiz Configuration Backend (3 days)

**Files to create/modify:**
```
backend/src/
├── attempts/
│   ├── dto/
│   │   └── start-attempt.dto.ts  # MODIFY
│   ├── attempts.controller.ts     # MODIFY
│   └── attempts.service.ts        # MODIFY
└── quizzes/
    ├── quizzes.controller.ts      # MODIFY (add stats endpoint)
    └── quizzes.service.ts         # MODIFY
```

**Implementation:**

```typescript
// DTO
export class QuizConfigDto {
  @IsOptional()
  @IsInt()
  @Min(5)
  questionCount?: number | null;
  
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;
  
  @IsOptional()
  @IsBoolean()
  shuffleOptions?: boolean;
}

export class StartAttemptDto {
  @IsUUID()
  quizId: string;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => QuizConfigDto)
  config?: QuizConfigDto;
}

// Service
@Injectable()
export class AttemptsService {
  async startAttempt(dto: StartAttemptDto, userId: string) {
    // Load default config if not provided
    const config = dto.config || await this.getUserDefaultConfig(userId);
    
    // Validate
    const totalQuestions = await this.getTotalQuestions(dto.quizId);
    if (config.questionCount && config.questionCount > totalQuestions) {
      throw new BadRequestException('Exceeds total questions');
    }
    
    // Get questions with config
    const questions = await this.questionsService.getQuestionsWithConfig(
      dto.quizId,
      config
    );
    
    // Create attempt
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId: dto.quizId,
        configSnapshot: config,
        selectedQuestions: questions.map(q => q.id),
        startedAt: new Date()
      }
    });
    
    return {
      attemptId: attempt.id,
      questions,
      config,
      metadata: {
        totalAvailable: totalQuestions,
        selected: questions.length,
        estimatedTime: this.calculateEstimatedTime(questions.length)
      }
    };
  }
}

// Stats endpoint
@Get(':id/stats')
async getQuizStats(@Param('id') id: string) {
  const totalQuestions = await this.prisma.question.count({
    where: { quizId: id }
  });
  
  const avgTimePerQuestion = await this.calculateAvgTime(id);
  
  return {
    totalQuestions,
    avgTimePerQuestion,
    avgQuizTime: Math.ceil((avgTimePerQuestion * totalQuestions) / 60)
  };
}
```

**Database Migration:**

```sql
ALTER TABLE quiz_attempts
ADD COLUMN config_snapshot JSONB,
ADD COLUMN selected_questions TEXT[];

ALTER TABLE user_preferences
ADD COLUMN default_question_count INTEGER DEFAULT NULL,
ADD COLUMN default_shuffle_questions BOOLEAN DEFAULT true,
ADD COLUMN default_shuffle_options BOOLEAN DEFAULT false;

CREATE INDEX idx_quiz_attempts_config ON quiz_attempts USING gin (config_snapshot);
```

---

#### Task 2.5: User Preferences CRUD (2 days)

**Files to create:**
```
backend/src/
└── users/
    ├── dto/
    │   └── update-preferences.dto.ts
    ├── users.controller.ts  # MODIFY
    └── users.service.ts     # MODIFY
```

**Implementation:**

```typescript
// DTO
export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsEnum(['small', 'medium', 'large'])
  fontSize?: string;

  @IsOptional()
  @IsBoolean()
  defaultShuffle?: boolean;

  @IsOptional()
  @IsBoolean()
  reviewMode?: boolean;
  
  @IsOptional()
  @IsInt()
  @Min(5)
  defaultQuestionCount?: number | null;
  
  @IsOptional()
  @IsBoolean()
  defaultShuffleQuestions?: boolean;
  
  @IsOptional()
  @IsBoolean()
  defaultShuffleOptions?: boolean;
}

// Service
async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
  return this.prisma.userPreferences.upsert({
    where: { userId },
    create: { userId, ...dto },
    update: dto
  });
}
```

---

### Frontend (React) - 15 days

#### Task 2.6: Practice Pages (5 days)

**Files to create:**
```
frontend/src/
├── pages/
│   └── practice/
│       ├── QuickPractice.tsx
│       ├── BookmarkedPractice.tsx
│       ├── WrongQuestionsPractice.tsx
│       └── PracticeRunner.tsx
└── components/
    └── practice/
        ├── PracticeCard.tsx
        ├── PracticeFilters.tsx
        └── PracticeResults.tsx
```

**Implementation:**

```tsx
// QuickPractice.tsx
export const QuickPractice: React.FC = () => {
  const [count, setCount] = useState(10);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const handleStart = async () => {
    const practice = await practiceService.createQuickPractice({
      count,
      categoryId,
      difficulty
    });
    navigate(`/practice/${practice.id}/take`);
  };

  return (
    <div className="quick-practice">
      <h1>Quick Practice</h1>
      
      <QuestionCountSelector value={count} onChange={setCount} />
      <CategoryFilter value={categoryId} onChange={setCategoryId} />
      <DifficultyFilter value={difficulty} onChange={setDifficulty} />
      
      <Button onClick={handleStart}>Start Practice</Button>
    </div>
  );
};

// PracticeRunner.tsx (similar to QuizRunner)
export const PracticeRunner: React.FC = () => {
  const { practiceId } = useParams();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Review mode state
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (optionId: string) => {
    const newAnswer = { questionId: currentQuestion.id, optionId };
    setAnswers([...answers, newAnswer]);

    if (reviewMode) {
      // Show instant feedback
      const correct = currentQuestion.options.find(o => o.isCorrect);
      setIsCorrect(optionId === correct.id);
      setShowFeedback(true);

      // Auto-proceed after 2 seconds or manual
      setTimeout(() => {
        if (!manualProceed) goToNextQuestion();
      }, 2000);
    } else {
      goToNextQuestion();
    }
  };

  return (
    <div className="practice-runner">
      {showFeedback && (
        <FeedbackBanner
          isCorrect={isCorrect}
          explanation={currentQuestion.explanation}
        />
      )}
      
      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        showResult={showFeedback}
      />
    </div>
  );
};
```

---

#### Task 2.7: Analytics Dashboard (4 days)

**Files to create:**
```
frontend/src/
├── pages/
│   └── Analytics.tsx
└── components/
    └── charts/
        ├── TopicPerformanceChart.tsx
        ├── ScoreTrendChart.tsx
        └── WeakTopicsCard.tsx
```

**Implementation:**

```tsx
// Analytics.tsx
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const Analytics: React.FC = () => {
  const { data: topicPerformance } = useQuery('topicPerformance', 
    () => analyticsService.getTopicPerformance()
  );
  const { data: scoreTrend } = useQuery('scoreTrend',
    () => analyticsService.getScoreTrend(30)
  );
  const { data: weakTopics } = useQuery('weakTopics',
    () => analyticsService.getWeakestTopics(3)
  );

  return (
    <div className="analytics-page">
      <h1>Your Performance Analytics</h1>

      {/* Topic Performance */}
      <Card title="Performance by Topic">
        <BarChart width={600} height={300} data={topicPerformance}>
          <XAxis dataKey="topic" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="accuracy" fill="#3b82f6" />
        </BarChart>
      </Card>

      {/* Score Trend */}
      <Card title="Score Trend (Last 30 Days)">
        <LineChart width={600} height={300} data={scoreTrend}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="percentage" stroke="#10b981" />
        </LineChart>
      </Card>

      {/* Weak Topics */}
      <Card title="Topics Needing Practice">
        {weakTopics?.map(topic => (
          <WeakTopicCard
            key={topic.id}
            topic={topic}
            onPractice={() => startPractice(topic)}
          />
        ))}
      </Card>
    </div>
  );
};
```

---

#### Task 2.8: Dark Mode Implementation (3 days)

**Files to create/modify:**
```
frontend/src/
├── hooks/
│   └── useDarkMode.ts
├── components/
│   └── DarkModeToggle.tsx
├── styles/
│   ├── light-theme.css
│   └── dark-theme.css
└── App.tsx  # MODIFY
```

**Implementation:**

```tsx
// useDarkMode.ts
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  return { isDark, toggleDarkMode: () => setIsDark(!isDark) };
};

// DarkModeToggle.tsx
export const DarkModeToggle: React.FC = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-600" />
      )}
    </button>
  );
};

// Update all components to use Tailwind dark classes
// Example:
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
```

**Tailwind Config:**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Define custom dark mode colors
      }
    }
  }
}
```

---

#### Task 2.9: Quiz Configuration Modal (3 days)

**Files to create:**
```
frontend/src/
├── components/
│   └── QuizConfigModal.tsx
├── hooks/
│   └── useQuizConfig.ts
└── pages/
    └── QuizDetail.tsx  # MODIFY
```

**Implementation:**

```tsx
// QuizConfigModal.tsx
interface QuizConfigModalProps {
  open: boolean;
  onClose: () => void;
  quiz: Quiz;
  stats: QuizStats;
  onStart: (config: QuizConfig) => void;
}

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  open,
  onClose,
  quiz,
  stats,
  onStart
}) => {
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [rememberSettings, setRememberSettings] = useState(false);

  const { loadSavedConfig, saveConfig } = useQuizConfig();

  useEffect(() => {
    if (open) {
      const saved = loadSavedConfig();
      setQuestionCount(saved.questionCount);
      setShuffleQuestions(saved.shuffleQuestions);
      setShuffleOptions(saved.shuffleOptions);
    }
  }, [open]);

  const estimatedTime = useMemo(() => {
    const count = questionCount || quiz.totalQuestions;
    return Math.ceil((count * stats.avgTimePerQuestion) / 60);
  }, [questionCount, quiz, stats]);

  const handleStart = () => {
    const config = { questionCount, shuffleQuestions, shuffleOptions };
    
    if (rememberSettings) {
      saveConfig(config);
    }
    
    onStart(config);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Your Quiz</DialogTitle>
        </DialogHeader>

        {/* Quick Presets */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <PresetButton
            label="Quick"
            count={10}
            time={Math.ceil((10 * stats.avgTimePerQuestion) / 60)}
            active={questionCount === 10}
            onClick={() => setQuestionCount(10)}
          />
          <PresetButton
            label="Medium"
            count={20}
            time={Math.ceil((20 * stats.avgTimePerQuestion) / 60)}
            active={questionCount === 20}
            onClick={() => setQuestionCount(20)}
          />
          <PresetButton
            label="Full"
            count={quiz.totalQuestions}
            time={stats.avgQuizTime}
            active={questionCount === null}
            onClick={() => setQuestionCount(null)}
          />
        </div>

        {/* Custom Slider */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Or choose custom:
          </label>
          <input
            type="range"
            min="5"
            max={quiz.totalQuestions}
            step="5"
            value={questionCount || quiz.totalQuestions}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>5 questions</span>
            <span className="font-medium">
              {questionCount || quiz.totalQuestions} questions
              (~{estimatedTime} min)
            </span>
            <span>{quiz.totalQuestions} questions</span>
          </div>
        </div>

        {/* Shuffle Options */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-medium">Shuffle question order</span>
            <Tooltip content="Randomize question sequence each time" />
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-medium">
              Shuffle answer options (A/B/C/D)
            </span>
            <Tooltip content="Randomize option order within each question" />
          </label>
        </div>

        {/* Remember Settings */}
        <label className="flex items-center space-x-3 mb-6">
          <input
            type="checkbox"
            checked={rememberSettings}
            onChange={(e) => setRememberSettings(e.target.checked)}
            className="w-5 h-5"
          />
          <span>Remember my settings for next time</span>
        </label>

        {/* Action Buttons */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStart}>
            Start Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// PresetButton component
const PresetButton: React.FC<{
  label: string;
  count: number;
  time: number;
  active: boolean;
  onClick: () => void;
}> = ({ label, count, time, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      p-4 rounded-lg border-2 transition-all
      ${active 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
        : 'border-gray-300 hover:border-gray-400'
      }
    `}
  >
    <div className="text-2xl mb-1">
      {label === 'Quick' && '⚡'}
      {label === 'Medium' && '📚'}
      {label === 'Full' && '🎯'}
    </div>
    <div className="font-semibold">{label}</div>
    <div className="text-sm text-gray-600">
      {count} questions
    </div>
    <div className="text-xs text-gray-500">
      ~{time} min
    </div>
  </button>
);
```

**useQuizConfig Hook:**

```tsx
export const useQuizConfig = () => {
  const loadSavedConfig = (): QuizConfig => {
    const saved = localStorage.getItem('quizConfig');
    return saved ? JSON.parse(saved) : {
      questionCount: null,
      shuffleQuestions: true,
      shuffleOptions: false
    };
  };
  
  const saveConfig = (config: QuizConfig) => {
    localStorage.setItem('quizConfig', JSON.stringify(config));
  };
  
  const clearConfig = () => {
    localStorage.removeItem('quizConfig');
  };
  
  return { loadSavedConfig, saveConfig, clearConfig };
};
```

**Integration in QuizDetail:**

```tsx
// QuizDetail.tsx
export const QuizDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const { data: quiz } = useQuery(['quiz', id], () => quizService.getById(id));
  const { data: stats } = useQuery(['quizStats', id], () => quizService.getStats(id));

  const handleStartQuiz = () => {
    setShowConfigModal(true);
  };

  const handleConfigConfirm = async (config: QuizConfig) => {
    try {
      const response = await attemptService.startAttempt(quiz.id, config);
      navigate(`/quiz/${response.attemptId}/take`);
    } catch (error) {
      toast.error('Failed to start quiz');
    }
  };

  return (
    <div className="quiz-detail">
      {/* Quiz info */}
      <QuizInfo quiz={quiz} />
      
      <Button onClick={handleStartQuiz}>
        Start Quiz
      </Button>

      {/* Configuration Modal */}
      <QuizConfigModal
        open={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        quiz={quiz}
        stats={stats}
        onStart={handleConfigConfirm}
      />
    </div>
  );
};
```

---

### Database - 2 days

#### Task 2.10: Schema Updates & Migrations (2 days)

**Migration 1: Practice Sessions**

```sql
-- Create practice_sessions table
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL,  -- 'QUICK', 'BOOKMARKED', 'WRONG'
  status VARCHAR(20) DEFAULT 'IN_PROGRESS',
  score INTEGER,
  total_questions INTEGER,
  time_spent INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_practice_sessions_user ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_type ON practice_sessions(type);
CREATE INDEX idx_practice_sessions_status ON practice_sessions(status);
```

**Migration 2: User Preferences**

```sql
-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  
  -- Appearance
  dark_mode BOOLEAN DEFAULT false,
  font_size VARCHAR(10) DEFAULT 'medium',
  
  -- Quiz defaults
  default_shuffle BOOLEAN DEFAULT true,
  review_mode BOOLEAN DEFAULT false,
  show_explanations BOOLEAN DEFAULT true,
  default_question_count INTEGER DEFAULT NULL,
  default_shuffle_questions BOOLEAN DEFAULT true,
  default_shuffle_options BOOLEAN DEFAULT false,
  
  -- Notifications
  email_reminders BOOLEAN DEFAULT true,
  browser_notify BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX idx_user_preferences_user ON user_preferences(user_id);
```

**Migration 3: Quiz Attempt Config**

```sql
-- Add config fields to quiz_attempts
ALTER TABLE quiz_attempts
ADD COLUMN config_snapshot JSONB,
ADD COLUMN selected_questions TEXT[];

-- Index for querying by config
CREATE INDEX idx_quiz_attempts_config ON quiz_attempts USING gin (config_snapshot);
```

**Migration 4: Wrong Answers Tracking**

```sql
-- Add metadata to user_answers for tracking
ALTER TABLE user_answers
ADD COLUMN attempt_number INTEGER DEFAULT 1,
ADD COLUMN corrected_on_retry BOOLEAN DEFAULT false;

-- Index for wrong questions query
CREATE INDEX idx_user_answers_wrong ON user_answers(user_id, is_correct)
WHERE is_correct = false;
```

---

## ✅ Acceptance Criteria

### Functional Criteria

- [ ] **Quick Practice Mode**
  - Users can select 5/10/15/20 questions
  - Filters (category, difficulty) work correctly
  - Time estimate shown accurately
  - Results show breakdown by topic

- [ ] **Flexible Quiz Configuration**
  - Configuration modal opens on "Start Quiz"
  - Quick presets (10q, 20q, Full) functional
  - Custom slider works (5 to max)
  - Shuffle toggles work correctly
  - Settings saved to preferences if checked
  - Quiz starts with selected config
  - Results reflect selected question count

- [ ] **Review Mode**
  - Toggle visible in quiz config
  - Instant feedback after answer selection
  - Correct/wrong indicator clear
  - Explanation shown (if available)
  - Can proceed manually or after 2s delay

- [ ] **Shuffle Features**
  - Questions randomized when enabled
  - Options randomized when enabled
  - Same quiz different order each time
  - User preference persisted

- [ ] **Practice Bookmarked Questions**
  - Bookmarked questions list accessible
  - Can practice all or subset
  - Start button generates practice session
  - Results accurate

- [ ] **Practice Wrong Questions**
  - Wrong questions list shows count per question
  - Sorted by most mistakes
  - Practice all or worst 10
  - Track if corrected on retry

- [ ] **Topic Analytics**
  - Bar chart shows accuracy by topic
  - Line chart shows score trend (30 days)
  - Weakest topics highlighted
  - One-click practice for weak topic

- [ ] **Dark Mode**
  - Toggle button in navbar
  - Smooth transition animation
  - All pages support dark mode
  - Preference persisted
  - Auto-detect system preference (optional)

- [ ] **User Preferences**
  - Preferences page accessible
  - All settings functional
  - Save button persists to database
  - Settings applied across app
  - Default values work

### UX Criteria

- [ ] **Intuitive Navigation**
  - Practice modes easily discoverable
  - Configuration modal clear and simple
  - Analytics dashboard readable
  - Dark mode toggle prominent

- [ ] **Performance**
  - Practice starts in <1 second
  - Analytics load in <2 seconds
  - Shuffle operations <500ms
  - Dark mode toggle instant

- [ ] **Mobile Responsive**
  - All new features work on mobile
  - Configuration modal fits mobile screen
  - Charts readable on small screens
  - Touch targets appropriate size

### Data Criteria

- [ ] **Accuracy**
  - Topic analytics match actual performance
  - Wrong questions list accurate
  - Score trends calculated correctly
  - Time estimates realistic

- [ ] **Persistence**
  - User preferences saved correctly
  - Dark mode persists across sessions
  - Shuffle preferences remembered
  - Practice history tracked

### Engagement Metrics (Post-Launch)

- [ ] Daily active users: +50% (target)
- [ ] Session time: +30% (target)
- [ ] Quiz completion rate: +25% (target)
- [ ] Practice mode adoption: >60% (target)
- [ ] Dark mode adoption: >35% (target)
- [ ] User satisfaction: >4.5/5 (target)

---

## ⚠️ Risks & Mitigation

### Risk 1: User Confusion with Too Many Options

**Probability:** Medium  
**Impact:** Medium

**Scenario:** Users overwhelmed by practice modes and configuration options

**Mitigation:**
1. **Progressive disclosure:** Show basic options first, advanced in dropdown
2. **Smart defaults:** Pre-select most common choices
3. **Onboarding tour:** First-time user walkthrough
4. **Tooltips:** Explain each option briefly
5. **Quick presets:** One-click common configurations

**Example:**
```tsx
<QuizConfigModal>
  {/* Simple mode by default */}
  <QuickPresets />
  
  {/* Advanced options collapsed */}
  <Accordion title="Advanced Options">
    <CustomSlider />
    <ShuffleToggles />
  </Accordion>
</QuizConfigModal>
```

---

### Risk 2: Analytics SQL Performance Issues

**Probability:** Medium  
**Impact:** High

**Scenario:** Complex aggregation queries slow down with large datasets

**Mitigation:**
1. **Database indexes:** On user_answers (user_id, question_id, is_correct)
2. **Caching:** Cache analytics for 15 minutes
3. **Pagination:** Limit query results
4. **Background jobs:** Pre-calculate analytics nightly
5. **Query optimization:** Use EXPLAIN ANALYZE to optimize

**Optimization:**
```sql
-- Add indexes
CREATE INDEX idx_user_answers_analytics ON user_answers(user_id, question_id, is_correct);
CREATE INDEX idx_quiz_attempts_completed ON quiz_attempts(user_id, completed_at) WHERE status = 'COMPLETED';

-- Cache results
const cacheKey = `analytics:${userId}`;
if (await cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
const results = await runQuery();
await cache.set(cacheKey, results, 900); // 15 minutes
```

---

### Risk 3: Leaderboard Unfairness with Flexible Config

**Probability:** High  
**Impact:** High

**Scenario:** User with 10/10 (100%) ranks higher than user with 45/50 (90%)

**Mitigation Options:**

**Option A: Separate Leaderboards (Recommended)**
```typescript
enum LeaderboardCategory {
  PRACTICE = 'PRACTICE',      // <50 questions
  MEDIUM = 'MEDIUM',           // 20-49 questions
  FULL = 'FULL'                // Full quiz only
}

if (config.questionCount < 20) {
  attempt.leaderboardCategory = 'PRACTICE';
} else if (config.questionCount < totalQuestions) {
  attempt.leaderboardCategory = 'MEDIUM';
} else {
  attempt.leaderboardCategory = 'FULL';
}
```

**Option B: Require Full Quiz for Leaderboard**
```typescript
if (config.questionCount !== totalQuestions) {
  attempt.eligibleForLeaderboard = false;
}
```

**Option C: Normalized Scoring**
```typescript
const normalizedScore = (score / selectedQuestions) * totalQuestions;
// Display actual score to user, use normalized for ranking
```

**Recommendation:** Option A (separate leaderboards) - most fair and clear

---

### Risk 4: Dark Mode Incomplete Coverage

**Probability:** Medium  
**Impact:** Low

**Scenario:** Some components not styled for dark mode

**Mitigation:**
1. **Component audit:** List all components before starting
2. **Systematic approach:** Update one module at a time
3. **Visual regression testing:** Screenshot comparison
4. **Design system:** Use consistent color tokens
5. **Code review:** Checklist for dark mode support

**Checklist:**
```
Dark Mode Component Checklist:
□ Background colors updated
□ Text colors updated
□ Border colors updated
□ Hover states work
□ Focus states work
□ Icons visible
□ Charts readable
□ Modals/dialogs styled
□ Forms styled
□ Buttons styled
```

---

### Risk 5: Wrong Questions Tracking Inaccuracy

**Probability:** Low  
**Impact:** Medium

**Scenario:** Wrong questions not tracked correctly due to edge cases

**Mitigation:**
1. **Clear definition:** "Wrong" = incorrect on first attempt
2. **Edge case handling:** 
   - Abandoned quiz: Don't count as wrong
   - Review mode: Count first answer only
   - Retakes: Track separately
3. **Data validation:** Check for inconsistencies
4. **User feedback:** Allow reporting incorrect tracking
5. **Testing:** Comprehensive test scenarios

**Edge Cases:**
```typescript
// Abandoned quiz - don't count
if (attempt.status !== 'COMPLETED') {
  // Skip tracking
}

// Review mode - count first answer only
if (reviewMode && existingAnswer) {
  // Don't update wrong count
}

// Retake - track separately
if (previousAttempt) {
  wrongAnswer.retryCount++;
  wrongAnswer.correctedOnRetry = isCorrect;
}
```

---

## 📅 Timeline

### Week 1: Practice Modes Backend (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Practice service setup | Backend Dev 1 | 8 |
| Tue | Quick practice logic | Backend Dev 1 | 8 |
| Wed | Bookmarked practice | Backend Dev 2 | 8 |
| Thu | Wrong questions practice | Backend Dev 2 | 8 |
| Fri | Testing & bug fixes | Both | 8 |

**Deliverable:** Practice endpoints functional

---

### Week 2: Analytics & Config Backend (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Analytics service | Backend Dev 1 | 8 |
| Tue | Topic performance SQL | Backend Dev 1 | 8 |
| Wed | Flexible quiz config backend | Backend Dev 2 | 8 |
| Thu | User preferences CRUD | Backend Dev 2 | 8 |
| Fri | Shuffle enhancement | Backend Dev 1 | 8 |

**Deliverable:** All backend endpoints ready

---

### Week 3: Practice Pages Frontend (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Quick practice UI | Frontend Dev 1 | 8 |
| Tue | Bookmarked practice UI | Frontend Dev 1 | 8 |
| Wed | Wrong questions UI | Frontend Dev 2 | 8 |
| Thu | Practice runner | Frontend Dev 2 | 8 |
| Fri | Review mode | Frontend Dev 1 | 8 |

**Deliverable:** Practice modes functional on frontend

---

### Week 4: Analytics & Dark Mode (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Analytics dashboard | Frontend Dev 1 | 8 |
| Tue | Charts integration | Frontend Dev 1 | 8 |
| Wed | Dark mode setup | Frontend Dev 2 | 8 |
| Thu | Dark mode component updates | Frontend Dev 2 | 8 |
| Fri | Dark mode testing | Frontend Dev 2 | 8 |

**Deliverable:** Analytics & dark mode complete

---

### Week 5: Quiz Config & Polish (5 days)

| Day | Task | Owner | Hours |
|-----|------|-------|-------|
| Mon | Quiz config modal | Frontend Dev 1 | 8 |
| Tue | Quiz config integration | Frontend Dev 1 | 8 |
| Wed | User preferences UI | Frontend Dev 2 | 8 |
| Thu | Testing all features | QA + All | 8 |
| Fri | Bug fixes & deployment | All | 8 |

**Deliverable:** Phase 2 complete and deployed

---

## 📦 Deliverables

### Backend Code

```
backend/src/
├── practice/
│   ├── practice.module.ts
│   ├── practice.service.ts
│   ├── practice.controller.ts
│   └── dto/
│       ├── quick-practice.dto.ts
│       ├── bookmarked-practice.dto.ts
│       └── wrong-questions.dto.ts
├── analytics/
│   ├── analytics.module.ts
│   ├── analytics.service.ts
│   └── analytics.controller.ts
├── attempts/
│   ├── dto/
│   │   └── start-attempt.dto.ts (updated)
│   ├── attempts.controller.ts (updated)
│   └── attempts.service.ts (updated)
└── users/
    ├── dto/
    │   └── update-preferences.dto.ts
    ├── users.controller.ts (updated)
    └── users.service.ts (updated)
```

---

### Frontend Code

```
frontend/src/
├── pages/
│   ├── practice/
│   │   ├── QuickPractice.tsx
│   │   ├── BookmarkedPractice.tsx
│   │   ├── WrongQuestionsPractice.tsx
│   │   └── PracticeRunner.tsx
│   ├── Analytics.tsx
│   └── QuizDetail.tsx (updated)
├── components/
│   ├── practice/
│   │   ├── PracticeCard.tsx
│   │   ├── PracticeFilters.tsx
│   │   └── PracticeResults.tsx
│   ├── charts/
│   │   ├── TopicPerformanceChart.tsx
│   │   ├── ScoreTrendChart.tsx
│   │   └── WeakTopicsCard.tsx
│   ├── QuizConfigModal.tsx
│   ├── DarkModeToggle.tsx
│   └── PreferencesPage.tsx
├── hooks/
│   ├── useDarkMode.ts
│   └── useQuizConfig.ts
└── styles/
    ├── light-theme.css
    └── dark-theme.css
```

---

### Database

```sql
-- Migrations
migrations/
├── 001_create_practice_sessions.sql
├── 002_create_user_preferences.sql
├── 003_add_quiz_attempt_config.sql
└── 004_enhance_wrong_answers_tracking.sql
```

---

### Documentation

1. **Practice Modes Guide**
   - How to use each practice mode
   - Configuration options
   - Best practices

2. **Analytics Guide**
   - Understanding performance metrics
   - Interpreting charts
   - Using insights to improve

3. **Customization Guide**
   - Quiz configuration options
   - Setting preferences
   - Dark mode usage

4. **User Onboarding Flow**
   - First-time user walkthrough
   - Feature highlights
   - Tips and tricks

---

### Performance Report

**Before Phase 2:**
```
User Engagement:
  Daily active users: Baseline
  Session time: Baseline
  Quiz completion rate: Baseline
  Retention (30-day): Baseline

Features:
  Practice modes: None
  Analytics: Basic score only
  Customization: None
  Themes: Light mode only
```

**After Phase 2:**
```
User Engagement:
  Daily active users: +50% (target)
  Session time: +30% (target)
  Quiz completion rate: +25% (target)
  Retention (30-day): +40% (target)

Features:
  Practice modes: 4 modes (Quick, Bookmarked, Wrong, Flexible)
  Analytics: Topic performance, score trends
  Customization: 9 user preferences
  Themes: Light + Dark mode
  
Adoption:
  Practice mode users: 60%
  Dark mode users: 35%
  Custom quiz config: 30%
  Analytics viewers: 60%
```

---

## 🎯 Success Criteria

Phase 2 is considered **COMPLETE** when:

### Feature Completion
- ✅ All 9 features implemented and tested
- ✅ Quick practice functional with filters
- ✅ Flexible quiz configuration with presets and custom slider
- ✅ Review mode shows instant feedback
- ✅ Shuffle works for questions and options
- ✅ Bookmarked practice generates sessions
- ✅ Wrong questions practice tracks mistakes
- ✅ Topic analytics accurate with charts
- ✅ Dark mode works on all pages
- ✅ User preferences save and apply

### Performance
- ✅ Practice starts in <1 second
- ✅ Analytics load in <2 seconds
- ✅ Dark mode toggle instant
- ✅ No performance regression from Phase 1

### User Experience
- ✅ All features intuitive and discoverable
- ✅ Mobile responsive on all screens
- ✅ Error handling graceful
- ✅ Loading states clear

### Data Integrity
- ✅ Practice sessions tracked correctly
- ✅ Analytics calculations accurate
- ✅ Preferences persist correctly
- ✅ Wrong questions list accurate

### Engagement (Monitor Post-Launch)
- 🎯 DAU +50% within 4 weeks
- 🎯 Session time +30% within 4 weeks
- 🎯 Completion rate +25% within 4 weeks
- 🎯 Practice adoption >60% within 4 weeks
- 🎯 User satisfaction >4.5/5

---

## 🔄 Transition to Phase 3

**Prerequisites for Phase 3:**
1. ✅ Phase 2 complete and stable
2. ✅ User engagement metrics improving
3. ✅ No critical bugs reported
4. ✅ Performance targets met

**Phase 3 Focus Shift:**
- Phase 2: User experience
- Phase 3: Admin tools and efficiency

**Dependencies from Phase 2:**
- Analytics foundation (for admin analytics)
- Practice session data (for content insights)
- User preferences system (for admin preferences)

**Recommendation:** Monitor Phase 2 metrics for 2 weeks before starting Phase 3 to ensure stability and gather user feedback.

---

## 📞 Support & Escalation

**During Phase 2 Implementation:**

**Technical Questions:**
- Backend: @backend-lead
- Frontend: @frontend-lead
- UI/UX: @design-lead

**Blockers:**
- Report in #phase2-dev Slack channel
- Tag @tech-lead for urgent issues

**Daily Standup:**
- Time: 10:00 AM
- Focus: Progress, blockers, dependencies
- Duration: 15 minutes

**Weekly Review:**
- Time: Friday 4:00 PM
- Demo: New features to stakeholders
- Retrospective: What went well, what to improve

---

**Status:** ✅ Ready for Implementation (after Phase 1)  
**Priority:** 🔴 HIGH  
**Next Step:** Complete Phase 1, then assign Phase 2 tasks

