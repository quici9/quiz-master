import { IsUUID, IsOptional, ValidateNested, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuizConfigDto {
    @ApiProperty({ required: false, description: 'Number of questions to attempt' })
    @IsOptional()
    @IsInt()
    @Min(5)
    questionCount?: number | null;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    shuffleQuestions?: boolean;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    shuffleOptions?: boolean;

    @ApiProperty({ required: false, default: false, description: 'Enable instant feedback mode' })
    @IsOptional()
    @IsBoolean()
    reviewMode?: boolean;
}

export class StartAttemptDto {
    @ApiProperty({ description: 'ID of the quiz to start' })
    @IsUUID()
    quizId: string;

    @ApiProperty({ required: false, description: 'Custom configuration for this attempt' })
    @IsOptional()
    @ValidateNested()
    @Type(() => QuizConfigDto)
    config?: QuizConfigDto;
}
