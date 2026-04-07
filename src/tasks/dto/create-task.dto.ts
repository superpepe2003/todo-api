import { IsString, IsOptional, IsEnum, IsInt, IsDateString, Min, Max, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar login con JWT' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Crear endpoints de auth con refresh token' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskType, default: TaskType.BACKEND })
  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @ApiProperty({ example: 1, description: 'ID de la aplicación a la que pertenece' })
  @IsInt()
  appId: number;

  @ApiPropertyOptional({ example: 2, description: 'ID del usuario asignado' })
  @IsInt()
  @IsOptional()
  assignedToId?: number;

  @ApiPropertyOptional({ example: 5, description: 'Días hábiles para calcular la deadline automáticamente' })
  @IsInt()
  @Min(1)
  @IsOptional()
  deadlineDays?: number;

  @ApiPropertyOptional({ example: '2026-04-15T00:00:00.000Z', description: 'Fecha límite exacta (alternativa a deadlineDays)' })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({ example: 3, description: 'Prioridad 1-5 (1=mínima, 5=máxima). Default 3.' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;
}
