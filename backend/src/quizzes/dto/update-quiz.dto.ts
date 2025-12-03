import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { QuestionDifficulty } from '@prisma/client';

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsEnum(QuestionDifficulty)
  @IsOptional()
  difficulty?: QuestionDifficulty;

  @IsInt()
  @Min(0)
  @IsOptional()
  timeLimit?: number; // Seconds
}

