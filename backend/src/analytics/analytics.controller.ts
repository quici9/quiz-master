import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { User } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('users/me/stats')
  async getUserStats(@User() user) {
    return this.analyticsService.getUserStats(user.id);
  }

  @Get('quizzes/:id/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getQuizAnalytics(@Param('id') quizId: string) {
    return this.analyticsService.getQuizAnalytics(quizId);
  }
}

