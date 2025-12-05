import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WrongQuestionsPracticeDto {
    @ApiProperty({ required: false, example: 10, description: 'Limit number of questions' })
    @IsOptional()
    @IsInt()
    @Min(5)
    @Max(50)
    count?: number;
}
