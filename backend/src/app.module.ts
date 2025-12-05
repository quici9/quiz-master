import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { AttemptsModule } from './attempts/attempts.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { PracticeModule } from './practice/practice.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    QuizzesModule,
    QuestionsModule,
    AttemptsModule,
    BookmarksModule,
    LeaderboardModule,
    AnalyticsModule,
    CacheModule,
    QueueModule,
    PracticeModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: 60000, // 1 minute
          limit: 100, // 100 requests per minute
        }],
        storage: new ThrottlerStorageRedisService({
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        }),
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ms, context }) => {
              return `${timestamp} [${level}] [${context || 'Application'}] ${message} ${ms}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply JWT guard globally
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
