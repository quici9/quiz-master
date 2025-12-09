import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CacheService } from '../cache/cache.service';

@Injectable()
export class QuestionsService {
    constructor(
        private prisma: PrismaService,
        private cacheService: CacheService,
    ) { }

    async findByQuiz(quizId: string, shuffle = false, shuffleOptions = false) {
        const cacheKey = `questions:${quizId}:${shuffle}:${shuffleOptions}`;
        const cached = await this.cacheService.get<any[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const questions = await this.prisma.question.findMany({
            where: { quizId },
            include: {
                options: {
                    select: {
                        id: true,
                        label: true,
                        text: true,
                        // Exclude isCorrect
                    },
                },
            },
            orderBy: { order: 'asc' },
        });

        if (shuffle) {
            this.shuffleArray(questions);
        }

        if (shuffleOptions) {
            questions.forEach(q => {
                this.shuffleArray(q.options);
                this.relabelOptions(q.options);
            });
        }

        await this.cacheService.set(cacheKey, questions, 3600 * 1000); // 1 hour
        return questions;
    }

    async getQuestionsWithConfig(quizId: string, config: { questionCount?: number | null, shuffleQuestions?: boolean, shuffleOptions?: boolean }) {
        let questions = await this.prisma.question.findMany({
            where: { quizId },
            include: {
                options: {
                    select: {
                        id: true,
                        label: true,
                        text: true,
                        // Exclude isCorrect
                    },
                },
            },
            orderBy: { order: 'asc' },
        });

        if (config.shuffleQuestions) {
            this.shuffleArray(questions);
        }

        if (config.questionCount && config.questionCount < questions.length) {
            questions = questions.slice(0, config.questionCount);
        }

        if (config.shuffleOptions) {
            questions.forEach(q => {
                this.shuffleArray(q.options);
                this.relabelOptions(q.options);
            });
        }

        return questions;
    }

    async getQuestionsForAttempt(attemptId: string, shuffleOptions = false) {
        // Get the attempt to retrieve selected questions
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            select: {
                selectedQuestions: true,
                configSnapshot: true,
                quizId: true,
            },
        });

        if (!attempt) {
            throw new NotFoundException('Attempt not found');
        }

        const selectedQuestionIds = attempt.selectedQuestions as string[];

        // Fetch only the selected questions
        const questions = await this.prisma.question.findMany({
            where: {
                id: { in: selectedQuestionIds },
            },
            include: {
                options: {
                    select: {
                        id: true,
                        label: true,
                        text: true,
                        // Exclude isCorrect
                    },
                },
            },
        });

        // Preserve the order from selectedQuestions array
        const orderedQuestions = selectedQuestionIds.map(id =>
            questions.find(q => q.id === id)
        ).filter(q => q !== undefined);

        if (shuffleOptions) {
            orderedQuestions.forEach(q => {
                this.shuffleArray(q.options);
                this.relabelOptions(q.options);
            });
        }

        return orderedQuestions;
    }

    private shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private relabelOptions(options: any[]) {
        options.forEach((option, index) => {
            option.label = String.fromCharCode(65 + index); // A, B, C, D, ...
        });
    }
}
