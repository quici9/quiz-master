import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePreferencesDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    darkMode?: boolean;

    @ApiProperty({ required: false, enum: ['small', 'medium', 'large'] })
    @IsOptional()
    @IsEnum(['small', 'medium', 'large'])
    fontSize?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    defaultShuffle?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    reviewMode?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(5)
    defaultQuestionCount?: number | null;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    defaultShuffleQuestions?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    defaultShuffleOptions?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    emailReminders?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    browserNotify?: boolean;
}
