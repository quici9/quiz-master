import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportQuizDto } from './dto/import-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizFilterDto } from './dto/quiz-filter.dto';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) { }

  @Post('import')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async importQuiz(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ImportQuizDto,
    @User() user,
  ) {
    return this.quizzesService.importQuiz(file, dto, user.email);
  }

  @Get()
  @Public()
  async findAll(@Query() filterDto: QuizFilterDto) {
    return this.quizzesService.findAll(filterDto);
  }

  @Get(':id/stats')
  @Public()
  async getQuizStats(@Param('id') id: string) {
    return this.quizzesService.getQuizStats(id);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizzesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
