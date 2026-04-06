import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min } from 'class-validator';
import { TaskType } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @IsInt()
  @IsOptional()
  assignedToId?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  deadlineDays?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}
