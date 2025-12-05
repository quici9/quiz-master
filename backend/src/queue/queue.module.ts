import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuizProcessorService } from './processors/quiz-processor.service';
import { JobsController } from './jobs.controller';
import { ParserService } from '../quizzes/services/parser.service';
import { QuizzesModule } from '../quizzes/quizzes.module';

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get('REDIS_HOST'),
                    port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: 'quiz-processing',
        }),
        QuizzesModule,
    ],
    controllers: [JobsController],
    providers: [QuizProcessorService],
    exports: [BullModule],
})
export class QueueModule { }
