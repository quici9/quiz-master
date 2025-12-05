import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { ParserService } from './services/parser.service';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, ParserService],
  exports: [QuizzesService, ParserService],
})
export class QuizzesModule { }
