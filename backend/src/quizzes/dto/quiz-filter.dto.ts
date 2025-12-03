import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { QuestionDifficulty } from '@prisma/client';

export class QuizFilterDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === '') return undefined;
    return value.toUpperCase();
  })
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;
}

