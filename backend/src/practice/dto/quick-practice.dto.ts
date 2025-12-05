import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuickPracticeDto {
    @ApiProperty({ example: 10, description: 'Number of questions' })
    @IsInt()
    @Min(5)
    @Max(50)
    count: number;

    @ApiProperty({ required: false, description: 'Filter by category ID' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false, description: 'Filter by difficulty' })
    @IsOptional()
    @IsString()
    difficulty?: string;
}
