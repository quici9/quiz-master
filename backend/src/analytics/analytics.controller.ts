import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('topics')
  @ApiOperation({ summary: 'Get performance by topic' })
  getUserTopicPerformance(@Request() req) {
    return this.analyticsService.getUserTopicPerformance(req.user.id);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get score trend over time' })
  getUserScoreTrend(@Request() req, @Query('days') days?: number) {
    return this.analyticsService.getUserScoreTrend(req.user.id, days ? Number(days) : 30);
  }

  @Get('weakest')
  @ApiOperation({ summary: 'Get weakest topics' })
  getWeakestTopics(@Request() req, @Query('limit') limit?: number) {
    return this.analyticsService.getWeakestTopics(req.user.id, limit ? Number(limit) : 3);
  }
}
