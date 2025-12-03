import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('quiz/:quizId')
  async findByQuiz(
    @Param('quizId') quizId: string,
    @Query('shuffle') shuffle?: string,
    @Query('shuffleOptions') shuffleOptions?: string,
  ) {
    const questions = await this.questionsService.findByQuiz(
      quizId,
      shuffle === 'true',
      shuffleOptions === 'true',
    );

    return {
      quizId,
      totalQuestions: questions.length,
      questions,
    };
  }
}
