import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) { }

  async getUserTopicPerformance(userId: string) {
    // Calculate accuracy per category
    // We join UserAnswers -> Question -> Quiz -> Category
    const results = await this.prisma.$queryRaw`
      SELECT 
        c.name as topic,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN ua."isCorrect" THEN 1 ELSE 0 END) as correct_count,
        ROUND(
          100.0 * SUM(CASE WHEN ua."isCorrect" THEN 1 ELSE 0 END) / COUNT(*),
          2
        ) as accuracy_percent
      FROM "attempt_answers" ua
      JOIN "questions" q ON ua."questionId" = q.id
      JOIN "quizzes" qz ON q."quizId" = qz.id
      JOIN "categories" c ON qz."categoryId" = c.id
      JOIN "quiz_attempts" qa ON ua."attemptId" = qa.id
      WHERE qa."userId" = ${userId}
      GROUP BY c.id, c.name
      ORDER BY accuracy_percent ASC
    `;

    // Prisma returns BigInt for COUNT/SUM, need to convert to number
    return (results as any[]).map(r => ({
      topic: r.topic,
      totalAttempts: Number(r.total_attempts),
      correctCount: Number(r.correct_count),
      accuracy: Number(r.accuracy_percent)
    }));
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
      percentage: a.score // Score is already 0-100
    }));
  }

  async getWeakestTopics(userId: string, limit: number = 3) {
    const performance = await this.getUserTopicPerformance(userId);
    // Filter for topics with enough data (e.g., at least 5 answers)
    return performance
      .filter(p => p.totalAttempts >= 5)
      .slice(0, limit);
  }
}
