import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
    constructor(private prisma: PrismaService) { }

    async findByQuiz(quizId: string, shuffle = false, shuffleOptions = false) {
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
            questions.forEach(q => this.shuffleArray(q.options));
        }

        return questions;
    }

    private shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
