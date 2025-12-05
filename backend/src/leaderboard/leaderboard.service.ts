import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttemptStatus } from '@prisma/client';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

import { CacheService } from '../cache/cache.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) { }

  async getWeeklyLeaderboard() {
    const period = dayjs().format('YYYY-[W]WW'); // e.g., "2024-W15"
    const cacheKey = `leaderboard:weekly:${period}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const leaderboard = await this.prisma.leaderboard.findMany({
      where: { period },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            xp: true,
            level: true,
          },
        },
      },
      orderBy: { rank: 'asc' },
      take: 10,
    });

    const result = {
      period,
      type: 'weekly',
      leaderboard,
    };

    await this.cacheService.set(cacheKey, result, 300 * 1000); // 5 minutes
    return result;
  }

  async getMonthlyLeaderboard() {
    const period = dayjs().format('YYYY-MM'); // e.g., "2024-03"
    const cacheKey = `leaderboard:monthly:${period}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const leaderboard = await this.prisma.leaderboard.findMany({
      where: { period },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            xp: true,
            level: true,
          },
        },
      },
      orderBy: { rank: 'asc' },
      take: 10,
    });

    const result = {
      period,
      type: 'monthly',
      leaderboard,
    };

    await this.cacheService.set(cacheKey, result, 300 * 1000); // 5 minutes
    return result;
  }

  async updateLeaderboard(userId: string) {
    // Calculate weekly period
    const period = dayjs().format('YYYY-[W]WW');

    // Get user's average score for the week
    const weekStart = dayjs().startOf('week').toDate();
    const weekEnd = dayjs().endOf('week').toDate();

    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId,
        status: AttemptStatus.COMPLETED,
        completedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      select: { score: true },
    });

    if (attempts.length === 0) return;

    const avgScore = Math.round(
      attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / attempts.length
    );

    // Upsert leaderboard entry
    await this.prisma.leaderboard.upsert({
      where: {
        userId_period: { userId, period },
      },
      update: { score: avgScore },
      create: { userId, period, score: avgScore, rank: 0 },
    });

    // Recalculate ranks for the period
    const allEntries = await this.prisma.leaderboard.findMany({
      where: { period },
      orderBy: { score: 'desc' },
    });

    for (let i = 0; i < allEntries.length; i++) {
      await this.prisma.leaderboard.update({
        where: { id: allEntries[i].id },
        data: { rank: i + 1 },
      });
    }

    // Invalidate caches
    await this.cacheService.invalidate('leaderboard:*');
  }
}

