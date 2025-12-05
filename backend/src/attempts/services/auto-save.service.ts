import { Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class AutoSaveService {
    constructor(private cacheService: CacheService) { }

    async saveProgress(attemptId: string, progress: any) {
        const key = `autosave:${attemptId}`;
        // Save for 24 hours
        await this.cacheService.set(key, progress, 24 * 60 * 60 * 1000);
    }

    async getProgress(attemptId: string) {
        const key = `autosave:${attemptId}`;
        return this.cacheService.get(key);
    }

    async clearProgress(attemptId: string) {
        const key = `autosave:${attemptId}`;
        await this.cacheService.del(key);
    }
}
