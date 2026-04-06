import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min, Max } from 'class-validator';
import { TaskType } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @IsInt()
  appId: number;

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
