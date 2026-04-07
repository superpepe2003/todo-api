import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateAppDto {
  @ApiPropertyOptional({ example: 'Portal de Clientes v2' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID de la categoría (null para quitar)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number | null;
}
