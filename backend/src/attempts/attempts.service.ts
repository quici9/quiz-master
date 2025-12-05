import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttemptStatus, Prisma } from '@prisma/client';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { StartAttemptDto } from './dto/start-attempt.dto';

@Injectable()
export class AttemptsService {
  constructor(
    private prisma: PrismaService,
    private leaderboardService: LeaderboardService,
  ) { }

  async startAttempt(userId: string, dto: StartAttemptDto) {
    const { quizId, config } = dto;

    // Check if quiz exists
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check for existing IN_PROGRESS attempt
    const existingAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        status: AttemptStatus.IN_PROGRESS,
      },
    });

    if (existingAttempt) {
      // Return existing attempt instead of throwing error
      return {
        attemptId: existingAttempt.id,
        quizId: existingAttempt.quizId,
        status: existingAttempt.status,
        startedAt: existingAttempt.startedAt,
        totalQuestions: existingAttempt.totalQuestions,
        isResumed: true, // Flag to indicate this is an existing attempt
      };
    }

    // Apply config defaults if not provided
    const finalConfig = {
      questionCount: config?.questionCount ?? null,
      shuffleQuestions: config?.shuffleQuestions ?? true,
      shuffleOptions: config?.shuffleOptions ?? false,
    };

    // Determine questions based on config
    // Note: We don't actually fetch questions here for storage, just count
    // But for Phase 2 we need to store selected questions if subset
    let selectedQuestionsCount = quiz.questions.length;
    let selectedQuestionIds: string[] = [];

    if (finalConfig.questionCount && finalConfig.questionCount < quiz.questions.length) {
      selectedQuestionsCount = finalConfig.questionCount;
      // We need to select random IDs here to persist which questions were chosen
      // This requires fetching IDs from QuestionsService (or here)
      // For now, let's assume QuestionsService handles the selection logic
      // But we need to store it in the attempt.
      // Let's use a helper to get IDs
      const allQuestionIds = quiz.questions.map(q => q.id);
      selectedQuestionIds = this.selectRandom(allQuestionIds, selectedQuestionsCount);
    } else {
      selectedQuestionIds = quiz.questions.map(q => q.id);
    }

    // Create new attempt
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        totalQuestions: selectedQuestionsCount,
        status: AttemptStatus.IN_PROGRESS,
        configSnapshot: finalConfig as any, // Store config
        selectedQuestions: selectedQuestionIds,
      },
    });

    return {
      attemptId: attempt.id,
      quizId: attempt.quizId,
      status: attempt.status,
      startedAt: attempt.startedAt,
      totalQuestions: attempt.totalQuestions,
      isResumed: false,
      config: finalConfig,
    };
  }

  private selectRandom<T>(array: T[], count: number): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  async answerQuestion(attemptId: string, userId: string, questionId: string, selectedOptionId: string) {
    // Verify attempt ownership
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Attempt is not in progress');
    }

    // Verify question belongs to quiz
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true, // Include all options to find correct one
      },
    });

    if (!question || question.quizId !== attempt.quizId) {
      throw new BadRequestException('Invalid question for this quiz');
    }

    // Verify selected option belongs to question
    const selectedOption = question.options.find(o => o.id === selectedOptionId);

    if (!selectedOption) {
      throw new BadRequestException('Invalid option for this question');
    }

    // Find correct option
    const correctOption = question.options.find(o => o.isCorrect);

    // Upsert answer (allow changing answer)
    await this.prisma.attemptAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      update: {
        selectedOptionId,
        isCorrect: selectedOption.isCorrect,
      },
      create: {
        attemptId,
        questionId,
        selectedOptionId,
        isCorrect: selectedOption.isCorrect,
      },
    });

    // Return feedback for Review Mode
    return {
      message: 'Answer saved successfully',
      isCorrect: selectedOption.isCorrect,
      correctOption: correctOption ? {
        id: correctOption.id,
        label: correctOption.label,
        text: correctOption.text,
        explanation: correctOption.explanation,
      } : null,
    };
  }

  async submitAttempt(attemptId: string, userId: string, timeSpent: number) {
    // Verify attempt ownership
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { answers: true },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Attempt already submitted');
    }

    // Calculate score
    const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / attempt.totalQuestions) * 100);

    // Update attempt
    const completed = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: AttemptStatus.COMPLETED,
        completedAt: new Date(),
        timeSpent,
        correctAnswers,
        score,
      },
    });

    // Update user stats (XP, streak)
    await this.updateUserStats(userId, score);

    // Update leaderboard
    await this.leaderboardService.updateLeaderboard(userId);

    return {
      attemptId: completed.id,
      status: completed.status,
      score: completed.score,
      correctAnswers: completed.correctAnswers,
      totalQuestions: completed.totalQuestions,
      timeSpent: completed.timeSpent,
      completedAt: completed.completedAt,
    };
  }

  async getMyAttempts(userId: string, page: number = 1, limit: number = 10, quizId?: string, status?: AttemptStatus) {
    const where: Prisma.QuizAttemptWhereInput = { userId };

    if (quizId) {
      where.quizId = quizId;
    }
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      this.prisma.quizAttempt.findMany({
        where,
        skip,
        take: limit,
        include: {
          quiz: {
            select: { id: true, title: true, totalQuestions: true },
          },
        },
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.quizAttempt.count({ where }),
    ]);

    return {
      attempts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAttemptById(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            timeLimit: true,
            totalQuestions: true,
          },
        },
        answers: {
          select: {
            questionId: true,
            selectedOptionId: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }

    // Convert answers array to object map { questionId: optionId }
    const answersMap = {};
    attempt.answers.forEach(answer => {
      answersMap[answer.questionId] = answer.selectedOptionId;
    });

    // Calculate time elapsed
    const timeElapsed = attempt.timeSpent || 0;

    return {
      id: attempt.id,
      quizId: attempt.quizId,
      status: attempt.status,
      quiz: attempt.quiz,
      answers: answersMap,
      timeElapsed,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      score: attempt.score,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
    };
  }

  async getAttemptReview(attemptId: string, userId: string) {
    // Verify ownership and completion
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: true,
        answers: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
            selectedOption: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }
    if (attempt.status !== AttemptStatus.COMPLETED) {
      throw new BadRequestException('Attempt not completed yet');
    }

    // Format response with correct answers
    const answers = attempt.answers.map(answer => {
      const correctOption = answer.question.options.find(opt => opt.isCorrect);

      if (!correctOption) {
        throw new BadRequestException(`No correct option found for question ${answer.question.id}`);
      }

      return {
        questionId: answer.question.id,
        questionText: answer.question.text,
        selectedOption: answer.selectedOption ? {
          id: answer.selectedOption.id,
          label: answer.selectedOption.label,
          text: answer.selectedOption.text,
        } : null,
        correctOption: {
          id: correctOption.id,
          label: correctOption.label,
          text: correctOption.text,
          explanation: correctOption.explanation,
        },
        isCorrect: answer.isCorrect,
        allOptions: answer.question.options.map(opt => ({
          id: opt.id,
          label: opt.label,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      };
    });

    return {
      attempt: {
        id: attempt.id,
        quizTitle: attempt.quiz.title,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt,
      },
      answers,
    };
  }

  async pauseAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Can only pause in-progress attempts');
    }

    await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: AttemptStatus.PAUSED,
        pausedAt: new Date(),
      },
    });

    return { message: 'Attempt paused successfully' };
  }

  async resumeAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }
    if (attempt.status !== AttemptStatus.PAUSED) {
      throw new BadRequestException('Can only resume paused attempts');
    }

    await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: AttemptStatus.IN_PROGRESS,
        resumedAt: new Date(),
      },
    });

    return { message: 'Attempt resumed successfully' };
  }

  async trackTabSwitch(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.userId !== userId) {
      throw new ForbiddenException('Not your attempt');
    }

    await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        tabSwitchCount: { increment: 1 },
        suspiciousActivity: true,
      },
    });

    return { message: 'Tab switch tracked' };
  }

  private async updateUserStats(userId: string, score: number) {
    // Calculate XP based on score
    const xpGained = Math.floor(score / 10); // 10 XP per 10 points

    // Update user XP and potentially level
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true, lastActiveAt: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newXp = user.xp + xpGained;
    const newLevel = Math.floor(newXp / 100) + 1; // Level up every 100 XP

    // Update streak
    const now = new Date();
    const lastActive = user.lastActiveAt;
    let newStreak = user.streak;

    if (lastActive) {
      const daysSinceLastActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastActive === 1) {
        newStreak += 1; // Increment streak
      } else if (daysSinceLastActive > 1) {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveAt: now,
      },
    });
  }
}
