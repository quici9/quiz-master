import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ImportQuizDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

