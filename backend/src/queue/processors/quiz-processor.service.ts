import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ParserService } from '../../quizzes/services/parser.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../cache/cache.service';

@Processor('quiz-processing')
export class QuizProcessorService extends WorkerHost {
    private readonly logger = new Logger(QuizProcessorService.name);

    constructor(
        private parserService: ParserService,
        private prisma: PrismaService,
        private cacheService: CacheService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Processing job ${job.id} of type ${job.name}`);

        switch (job.name) {
            case 'parse-word':
                return this.handleParseWord(job);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async handleParseWord(job: Job) {
        const { fileBuffer, dto, adminEmail, fileName } = job.data;

        // Convert hex string back to buffer if needed (Redis stores as JSON)
        const buffer = Buffer.from(fileBuffer, 'base64');

        try {
            this.logger.log(`Parsing DOCX file: ${fileName}`);

            // Parse file
            const parsedQuiz = await this.parserService.parseDocx(buffer);

            this.logger.log(`Parsed ${parsedQuiz.totalValid} valid questions from ${parsedQuiz.totalParsed} total questions`);

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
                        fileName: fileName,
                    },
                });

                this.logger.log(`Created quiz: ${createdQuiz.title} (ID: ${createdQuiz.id})`);

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

                this.logger.log(`Created ${parsedQuiz.totalValid} questions for quiz ${createdQuiz.id}`);

                return createdQuiz;
            });

            // Invalidate quiz list cache so new quiz appears immediately
            await this.cacheService.invalidate('quizzes:list:*');
            this.logger.log(`Cache invalidated for quiz lists`);

            this.logger.log(`✅ Successfully completed import for job ${job.id}: Quiz "${quiz.title}" with ${parsedQuiz.totalValid} questions`);

            return {
                quizId: quiz.id,
                quizTitle: quiz.title,
                stats: {
                    questionsCreated: parsedQuiz.totalValid,
                    totalParsed: parsedQuiz.totalParsed,
                    errors: parsedQuiz.errors,
                },
            };
        } catch (error) {
            this.logger.error(`❌ Failed to process quiz import for job ${job.id}: ${error.message}`, error.stack);
            throw error;
        }
    }
}

