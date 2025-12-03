import { Module } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [PrismaModule, LeaderboardModule],
  providers: [AttemptsService],
  controllers: [AttemptsController],
  exports: [AttemptsService],
})
export class AttemptsModule {}
