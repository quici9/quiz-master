import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { QuickPracticeDto } from './dto/quick-practice.dto';
import { BookmarkedPracticeDto } from './dto/bookmarked-practice.dto';
import { WrongQuestionsPracticeDto } from './dto/wrong-questions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Practice')
@Controller('practice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PracticeController {
    constructor(private readonly practiceService: PracticeService) { }

    @Post('quick')
    @ApiOperation({ summary: 'Start a quick practice session' })
    createQuickPractice(@Request() req, @Body() dto: QuickPracticeDto) {
        return this.practiceService.createQuickPractice(req.user.id, dto);
    }

    @Post('bookmarked')
    @ApiOperation({ summary: 'Start a practice session with bookmarked questions' })
    createBookmarkedPractice(@Request() req, @Body() dto: BookmarkedPracticeDto) {
        return this.practiceService.createBookmarkedPractice(req.user.id, dto);
    }

    @Post('wrong')
    @ApiOperation({ summary: 'Start a practice session with wrong questions' })
    createWrongQuestionsPractice(@Request() req, @Body() dto: WrongQuestionsPracticeDto) {
        return this.practiceService.createWrongQuestionsPractice(req.user.id, dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a practice session' })
    getPracticeSession(@Request() req, @Param('id') id: string) {
        return this.practiceService.getPracticeSession(id, req.user.id);
    }
}
