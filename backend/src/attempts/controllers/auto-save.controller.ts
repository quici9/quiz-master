import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AutoSaveService } from '../services/auto-save.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('attempts/:attemptId/autosave')
@UseGuards(JwtAuthGuard)
export class AutoSaveController {
    constructor(private autoSaveService: AutoSaveService) { }

    @Post()
    async saveProgress(
        @Param('attemptId') attemptId: string,
        @Body() progress: any,
    ) {
        await this.autoSaveService.saveProgress(attemptId, progress);
        return { message: 'Progress saved' };
    }

    @Get()
    async getProgress(@Param('attemptId') attemptId: string) {
        const progress = await this.autoSaveService.getProgress(attemptId);
        return { progress };
    }

    @Delete()
    async clearProgress(@Param('attemptId') attemptId: string) {
        await this.autoSaveService.clearProgress(attemptId);
        return { message: 'Progress cleared' };
    }
}
