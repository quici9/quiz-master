import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { User } from '../common/decorators/user.decorator';
import { AttemptStatus } from '@prisma/client';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('start')
  async startAttempt(@Body('quizId') quizId: string, @User() user) {
    return this.attemptsService.startAttempt(user.id, quizId);
  }

  @Post(':id/answer')
  async answerQuestion(
    @Param('id') attemptId: string,
    @Body('questionId') questionId: string,
    @Body('selectedOptionId') selectedOptionId: string,
    @User() user,
  ) {
    return this.attemptsService.answerQuestion(attemptId, user.id, questionId, selectedOptionId);
  }

  @Post(':id/submit')
  async submitAttempt(
    @Param('id') attemptId: string,
    @Body('timeSpent') timeSpent: number,
    @User() user,
  ) {
    return this.attemptsService.submitAttempt(attemptId, user.id, timeSpent);
  }

  @Get('my')
  async getMyAttempts(
    @User() user,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('quizId') quizId?: string,
    @Query('status') status?: AttemptStatus,
  ) {
    return this.attemptsService.getMyAttempts(user.id, +page, +limit, quizId, status);
  }

  @Get(':id')
  async getAttemptById(@Param('id') attemptId: string, @User() user) {
    return this.attemptsService.getAttemptById(attemptId, user.id);
  }

  @Get(':id/review')
  async getAttemptReview(@Param('id') attemptId: string, @User() user) {
    return this.attemptsService.getAttemptReview(attemptId, user.id);
  }

  @Post(':id/pause')
  async pauseAttempt(@Param('id') attemptId: string, @User() user) {
    return this.attemptsService.pauseAttempt(attemptId, user.id);
  }

  @Post(':id/resume')
  async resumeAttempt(@Param('id') attemptId: string, @User() user) {
    return this.attemptsService.resumeAttempt(attemptId, user.id);
  }

  @Post(':id/tab-switch')
  async trackTabSwitch(@Param('id') attemptId: string, @User() user) {
    return this.attemptsService.trackTabSwitch(attemptId, user.id);
  }
}
