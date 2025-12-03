import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParserService } from './services/parser.service';
import { ImportQuizDto } from './dto/import-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizFilterDto } from './dto/quiz-filter.dto';
import { Prisma, AttemptStatus } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private parserService: ParserService,
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

    // Parse file
    const parsedQuiz = await this.parserService.parseDocx(file.buffer);

    // Create quiz with questions in transaction
    const quiz = await this.prisma.$transaction(async (tx) => {
      // Create quiz
      const createdQuiz = await tx.quiz.create({
        data: {
          title: dto.title,
          description: dto.description,
          categoryId: dto.categoryId,
          totalQuestions: parsedQuiz.totalValid,
          createdBy: adminEmail,
          fileName: file.originalname,
        },
      });

      // Create questions with options
      for (const q of parsedQuiz.questions) {
        await tx.question.create({
          data: {
            quizId: createdQuiz.id,
            text: q.text,
            order: q.order,
            options: {
              create: q.options.map(opt => ({
                label: opt.label,
                text: opt.text,
                isCorrect: opt.label === q.correctAnswer,
              })),
            },
          },
        });
      }

      return createdQuiz;
    });

    const response = {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        totalQuestions: quiz.totalQuestions,
        fileName: quiz.fileName,
        createdAt: quiz.createdAt,
      },
      stats: {
        questionsCreated: parsedQuiz.totalValid,
        optionsCreated: parsedQuiz.questions.reduce((sum, q) => sum + q.options.length, 0),
        totalParsed: parsedQuiz.totalParsed,
        errors: parsedQuiz.errors,
      },
    };
    return response;
  }

  async findAll(filterDto: QuizFilterDto) {
    const where: Prisma.QuizWhereInput = {
      isPublished: true,
    };

    if (filterDto.search) {
      where.OR = [
        { title: { contains: filterDto.search, mode: 'insensitive' } },
        { description: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    if (filterDto.categoryId) {
      where.categoryId = filterDto.categoryId;
    }

    if (filterDto.difficulty) {
      where.difficulty = filterDto.difficulty;
    }

    const page = filterDto.page ?? 1;
    const limit = filterDto.limit ?? 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const [quizzes, total] = await Promise.all([
      this.prisma.quiz.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          totalQuestions: true,
          difficulty: true,
          timeLimit: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          createdAt: true,
        },
      }),
      this.prisma.quiz.count({ where }),
    ]);

    return {
      quizzes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
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

    return {
      ...quiz,
      stats: {
        totalAttempts: quiz._count.attempts,
        averageScore: Math.round(averageScore * 10) / 10,
      },
    };
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

    return { message: 'Quiz deleted successfully' };
  }
}
