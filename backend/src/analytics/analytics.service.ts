import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttemptStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    // Get total attempts
    const totalAttempts = await this.prisma.quizAttempt.count({
      where: { userId, status: AttemptStatus.COMPLETED },
    });

    // Get all completed attempts
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, status: AttemptStatus.COMPLETED },
      select: { score: true, completedAt: true },
      orderBy: { completedAt: 'desc' },
    });

    const avgScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / attempts.length
      : 0;

    // Get highest/lowest score
    const scores = attempts.map(a => a.score).filter((s): s is number => s !== null);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    // Calculate recent trend
    const last5 = attempts.slice(0, 5).reverse();
    let trend: 'improving' | 'declining' | 'stable' = 'stable';

    if (last5.length >= 3) {
      const firstScore1 = last5[0]?.score ?? 0;
      const firstScore2 = last5[1]?.score ?? 0;
      const lastScore1 = last5[last5.length - 2]?.score ?? 0;
      const lastScore2 = last5[last5.length - 1]?.score ?? 0;
      const firstAvg = (firstScore1 + firstScore2) / 2;
      const lastAvg = (lastScore1 + lastScore2) / 2;
      
      if (lastAvg > firstAvg + 5) trend = 'improving';
      else if (lastAvg < firstAvg - 5) trend = 'declining';
    }

    // Identify weak areas (most incorrect questions)
    const weakQuestions = await this.prisma.attemptAnswer.groupBy({
      by: ['questionId'],
      where: {
        attempt: { userId },
        isCorrect: false,
      },
      _count: { questionId: true },
      orderBy: { _count: { questionId: 'desc' } },
      take: 5,
    });

    const weakQuestionsDetails = await this.prisma.question.findMany({
      where: { id: { in: weakQuestions.map(w => w.questionId) } },
      select: { 
        id: true, 
        text: true, 
        quiz: { select: { title: true } } 
      },
    });

    const weakAreas = weakQuestionsDetails.map(q => {
      const count = weakQuestions.find(w => w.questionId === q.id)?._count.questionId || 0;
      return {
        questionId: q.id,
        questionText: q.text.substring(0, 100) + (q.text.length > 100 ? '...' : ''),
        quizTitle: q.quiz.title,
        incorrectCount: count,
      };
    });

    return {
      totalAttempts,
      averageScore: Math.round(avgScore * 10) / 10,
      highestScore,
      lowestScore,
      trend,
      recentAttempts: last5.map(a => ({
        score: a.score ?? 0,
        completedAt: a.completedAt,
      })),
      weakAreas,
    };
  }

  async getQuizAnalytics(quizId: string) {
    // Get quiz info
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        totalQuestions: true,
        difficulty: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    // Get total attempts
    const totalAttempts = await this.prisma.quizAttempt.count({
      where: { quizId, status: AttemptStatus.COMPLETED },
    });

    // Calculate average score
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { quizId, status: AttemptStatus.COMPLETED },
      select: { score: true, timeSpent: true },
    });

    const avgScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / attempts.length
      : 0;

    const avgTimeSpent = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / attempts.length
      : 0;

    // Get question-level statistics
    const questions = await this.prisma.question.findMany({
      where: { quizId },
      select: {
        id: true,
        text: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });

    const questionStats = await Promise.all(
      questions.map(async (q) => {
        const totalAnswered = await this.prisma.attemptAnswer.count({
          where: { questionId: q.id },
        });
        
        const correctCount = await this.prisma.attemptAnswer.count({
          where: { questionId: q.id, isCorrect: true },
        });
        
        const correctRate = totalAnswered > 0
          ? (correctCount / totalAnswered) * 100
          : 0;
        
        return {
          questionId: q.id,
          text: q.text.substring(0, 100) + (q.text.length > 100 ? '...' : ''),
          order: q.order,
          totalAnswered,
          correctCount,
          correctRate: Math.round(correctRate * 10) / 10,
        };
      })
    );

    return {
      quiz,
      totalAttempts,
      averageScore: Math.round(avgScore * 10) / 10,
      averageTimeSpent: Math.round(avgTimeSpent),
      questionStats,
    };
  }
}

