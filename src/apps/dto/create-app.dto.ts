import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppDto {
  @ApiProperty({ example: 'Portal de Clientes', description: 'Nombre de la aplicación' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Gestión del portal web para clientes externos' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID de la categoría (opcional)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;
}
