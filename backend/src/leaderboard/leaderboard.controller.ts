import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('weekly')
  @Public()
  async getWeeklyLeaderboard() {
    return this.leaderboardService.getWeeklyLeaderboard();
  }

  @Get('monthly')
  @Public()
  async getMonthlyLeaderboard() {
    return this.leaderboardService.getMonthlyLeaderboard();
  }
}

