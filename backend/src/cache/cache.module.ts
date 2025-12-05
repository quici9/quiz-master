import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheService } from './cache.service';

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: await redisStore({
                    host: configService.get('REDIS_HOST'),
                    port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
                    ttl: 600 * 1000, // 10 minutes default
                }),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [CacheService],
    exports: [NestCacheModule, CacheService],
})
export class CacheModule { }
