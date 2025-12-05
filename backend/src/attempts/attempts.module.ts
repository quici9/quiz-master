import { Module } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AutoSaveService } from './services/auto-save.service';
import { AutoSaveController } from './controllers/auto-save.controller';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [PrismaModule, LeaderboardModule],
  controllers: [AttemptsController, AutoSaveController],
  providers: [AttemptsService, AutoSaveService],
  exports: [AttemptsService],
})
export class AttemptsModule { }
