import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuickPracticeDto } from './dto/quick-practice.dto';
import { BookmarkedPracticeDto } from './dto/bookmarked-practice.dto';
import { WrongQuestionsPracticeDto } from './dto/wrong-questions.dto';
import { PracticeType, AttemptStatus, Question, QuestionOption } from '@prisma/client';

@Injectable()
export class PracticeService {
    constructor(private prisma: PrismaService) { }

    async createQuickPractice(userId: string, dto: QuickPracticeDto) {
        const { count, categoryId, difficulty } = dto;

        // Build where clause
        const where: any = {};
        if (categoryId) {
            where.quiz = { categoryId };
        }
        if (difficulty) {
            where.difficulty = difficulty;
        }

        // Get all matching questions IDs first to pick random ones
        const allQuestions = await this.prisma.question.findMany({
            where,
            select: { id: true },
        });

        if (allQuestions.length === 0) {
            throw new NotFoundException('No questions found matching criteria');
        }

        // Select random questions
        const selectedIds = this.selectRandom(allQuestions, Math.min(count, allQuestions.length)).map(q => q.id);

        // Fetch full question details
        const questions = await this.prisma.question.findMany({
            where: { id: { in: selectedIds } },
            include: {
                options: true, // Include isCorrect for practice mode (Review Mode support)
            },
        });

        // Create practice session
        const session = await this.prisma.practiceSession.create({
            data: {
                userId,
                type: PracticeType.QUICK,
                status: AttemptStatus.IN_PROGRESS,
                questions: {
                    connect: selectedIds.map(id => ({ id })),
                },
            },
        });

        return {
            practiceId: session.id,
            questions: this.shuffleQuestions(questions), // Shuffle questions and options
            totalAvailable: allQuestions.length,
        };
    }

    async createBookmarkedPractice(userId: string, dto: BookmarkedPracticeDto) {
        const { count } = dto;

        // Get user bookmarks
        const bookmarks = await this.prisma.questionBookmark.findMany({
            where: { userId },
            select: { questionId: true },
        });

        if (bookmarks.length === 0) {
            throw new NotFoundException('No bookmarked questions found');
        }

        let selectedIds = bookmarks.map(b => b.questionId);
        if (count && count < selectedIds.length) {
            selectedIds = this.selectRandom(selectedIds, count);
        }

        const questions = await this.prisma.question.findMany({
            where: { id: { in: selectedIds } },
            include: { options: true },
        });

        const session = await this.prisma.practiceSession.create({
            data: {
                userId,
                type: PracticeType.BOOKMARKED,
                status: AttemptStatus.IN_PROGRESS,
                questions: {
                    connect: selectedIds.map(id => ({ id })),
                },
            },
        });

        return {
            practiceId: session.id,
            questions: this.shuffleQuestions(questions),
            totalAvailable: bookmarks.length,
        };
    }

    async createWrongQuestionsPractice(userId: string, dto: WrongQuestionsPracticeDto) {
        const { count } = dto;

        // Find questions user got wrong
        // We look at AttemptAnswer where isCorrect = false
        const wrongAnswers = await this.prisma.attemptAnswer.findMany({
            where: {
                attempt: { userId },
                isCorrect: false,
            },
            select: { questionId: true },
            distinct: ['questionId'], // Unique questions
        });

        if (wrongAnswers.length === 0) {
            throw new NotFoundException('No wrong questions found in your history');
        }

        let selectedIds = wrongAnswers.map(w => w.questionId);
        if (count && count < selectedIds.length) {
            selectedIds = this.selectRandom(selectedIds, count);
        }

        const questions = await this.prisma.question.findMany({
            where: { id: { in: selectedIds } },
            include: { options: true },
        });

        const session = await this.prisma.practiceSession.create({
            data: {
                userId,
                type: PracticeType.WRONG,
                status: AttemptStatus.IN_PROGRESS,
                questions: {
                    connect: selectedIds.map(id => ({ id })),
                },
            },
        });

        return {
            practiceId: session.id,
            questions: this.shuffleQuestions(questions),
            totalAvailable: wrongAnswers.length,
        };
    }

    async getPracticeSession(sessionId: string, userId: string) {
        const session = await this.prisma.practiceSession.findUnique({
            where: { id: sessionId },
            include: {
                questions: {
                    include: { options: true },
                },
            },
        });

        if (!session) {
            throw new NotFoundException('Practice session not found');
        }
        if (session.userId !== userId) {
            throw new BadRequestException('Not your session');
        }

        return session;
    }

    // Helper to select N random items from array
    private selectRandom<T>(array: T[], count: number): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    // Helper to shuffle questions and their options
    private shuffleQuestions(questions: (Question & { options: QuestionOption[] })[]) {
        const shuffledQuestions = this.selectRandom(questions, questions.length);
        return shuffledQuestions.map(q => ({
            ...q,
            options: this.selectRandom(q.options, q.options.length),
        }));
    }
}
