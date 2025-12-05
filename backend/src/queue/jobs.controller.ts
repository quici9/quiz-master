import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('jobs')
export class JobsController {
    constructor(@InjectQueue('quiz-processing') private quizQueue: Queue) { }

    @Get(':id')
    async getJobStatus(@Param('id') id: string) {
        const job = await this.quizQueue.getJob(id);

        if (!job) {
            throw new NotFoundException(`Job with ID ${id} not found`);
        }

        const state = await job.getState();
        const result = job.returnvalue;
        const error = job.failedReason;
        const progress = job.progress;

        return {
            id: job.id,
            state,
            progress,
            result,
            error,
            createdAt: job.timestamp,
            finishedAt: job.finishedOn,
        };
    }
}
