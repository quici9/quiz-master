import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async get<T>(key: string): Promise<T | undefined> {
        return this.cacheManager.get<T>(key);
    }

    async set(key: string, value: unknown, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async invalidate(pattern: string): Promise<void> {
        try {
            const store = (this.cacheManager as any).store;

            // Try multiple methods to get keys
            if (store && store.client) {
                // Redis client available - use SCAN
                const keys: string[] = [];
                const client = store.client;

                // Convert glob pattern to Redis pattern
                const redisPattern = pattern.replace(/\*/g, '*');

                let cursor = '0';
                do {
                    const result = await client.scan(cursor, 'MATCH', redisPattern, 'COUNT', 100);
                    cursor = result[0];
                    if (result[1] && result[1].length > 0) {
                        keys.push(...result[1]);
                    }
                } while (cursor !== '0');

                if (keys.length > 0) {
                    await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
                    console.log(`Invalidated ${keys.length} cache keys matching pattern "${pattern}"`);
                } else {
                    console.log(`No cache keys found matching pattern "${pattern}"`);
                }
            } else if (store && typeof store.keys === 'function') {
                // Fallback to keys() method
                const keys = await store.keys(pattern);
                if (keys && keys.length > 0) {
                    await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
                    console.log(`Invalidated ${keys.length} cache keys matching pattern "${pattern}"`);
                } else {
                    console.log(`No cache keys found matching pattern "${pattern}"`);
                }
            } else {
                // No method available - just warn
                console.warn(`Cache invalidation for pattern "${pattern}" not available - cache will expire naturally`);
            }
        } catch (error) {
            console.error(`Failed to invalidate cache pattern "${pattern}":`, error.message);
            // Don't throw - cache invalidation failure shouldn't break the main operation
        }
    }
}
