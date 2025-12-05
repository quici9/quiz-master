import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParserService } from './services/parser.service';
import { ImportQuizDto } from './dto/import-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizFilterDto } from './dto/quiz-filter.dto';
import { Prisma, AttemptStatus } from '@prisma/client';

import { CacheService } from '../cache/cache.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private parserService: ParserService,
    private cacheService: CacheService,
    @InjectQueue('quiz-processing') private quizQueue: Queue,
  ) { }

  async importQuiz(file: Express.Multer.File, dto: ImportQuizDto, adminEmail: string) {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.originalname.endsWith('.docx')) {
      throw new BadRequestException('Only .docx files are supported');
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new BadRequestException('File size exceeds 10MB');
    }

    // Add job to queue
    const job = await this.quizQueue.add('parse-word', {
      fileBuffer: file.buffer.toString('base64'), // Redis stores JSON, so encode buffer
      dto,
      adminEmail,
      fileName: file.originalname,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    });

    return {
      message: 'File uploaded successfully. Processing started.',
      jobId: job.id,
      status: 'processing',
    };
  }

  async findAll(filters?: {
    search?: string;
    difficulty?: string;
    categoryId?: string;
    limit?: number;
    offset?: number;
  }) {
    const { search, difficulty, categoryId, limit = 20, offset = 0 } = filters || {};

    // DISABLE CACHING for quiz list to prevent stale data after delete
    // Cache invalidation doesn't work reliably, so we skip caching entirely
    // This is acceptable as quiz list queries are not expensive

    // Build query
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [quizzes, total] = await Promise.all([
      this.prisma.quiz.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { questions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      this.prisma.quiz.count({ where }),
    ]);

    return {
      quizzes: quizzes.map(quiz => ({
        ...quiz,
        questionsCount: quiz._count.questions,
        totalQuestions: quiz._count.questions,
      })),
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    };
  }

  async findOne(id: string) {
    const cacheKey = `quizzes:detail:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { attempts: true },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    // Calculate stats
    const completedAttempts = await this.prisma.quizAttempt.findMany({
      where: { quizId: id, status: AttemptStatus.COMPLETED },
      select: { score: true },
    });

    const averageScore = completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / completedAttempts.length
      : 0;

    const result = {
      ...quiz,
      stats: {
        totalAttempts: quiz._count.attempts,
        averageScore: Math.round(averageScore * 10) / 10,
      },
    };

    await this.cacheService.set(cacheKey, result, 3600 * 1000); // 1 hour
    return result;
  }

  async update(id: string, dto: UpdateQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    const updated = await this.prisma.quiz.update({
      where: { id },
      data: dto,
      include: { category: true },
    });

    return updated;
  }

  async remove(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    await this.prisma.quiz.delete({ where: { id } });

    // Invalidate caches
    await this.cacheService.del(`quizzes:detail:${id}`);
    await this.cacheService.invalidate('quizzes:list:*');

    return { message: 'Quiz deleted successfully' };
  }
  async getQuizStats(id: string) {
    const totalQuestions = await this.prisma.question.count({
      where: { quizId: id }
    });

    // Calculate average time per question based on past attempts
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        quizId: id,
        status: AttemptStatus.COMPLETED,
        timeSpent: { not: null }
      },
      select: { timeSpent: true, totalQuestions: true },
      take: 100 // Limit to last 100 attempts
    });

    let avgTimePerQuestion = 60; // Default 1 minute

    if (attempts.length > 0) {
      const totalTime = attempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
      const totalQs = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
      if (totalQs > 0) {
        avgTimePerQuestion = totalTime / totalQs;
      }
    }

    return {
      totalQuestions,
      avgTimePerQuestion: Math.round(avgTimePerQuestion),
      avgQuizTime: Math.ceil((avgTimePerQuestion * totalQuestions) / 60)
    };
  }
}
