import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Implementar login con JWT y refresh token' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskType })
  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @ApiPropertyOptional({ example: 3, description: 'ID del nuevo usuario asignado' })
  @IsInt()
  @IsOptional()
  assignedToId?: number;

  @ApiPropertyOptional({ example: 7, description: 'Nuevos días hábiles para recalcular deadline' })
  @IsInt()
  @Min(1)
  @IsOptional()
  deadlineDays?: number;

  @ApiPropertyOptional({ example: '2026-04-20T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({ example: 4, description: 'Prioridad 1-5 (1=mínima, 5=máxima)' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;
}
