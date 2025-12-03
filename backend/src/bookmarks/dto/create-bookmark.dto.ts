import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @IsOptional()
  note?: string;
}

