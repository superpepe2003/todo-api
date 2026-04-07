import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Frontend', description: 'Nombre único de la categoría' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '#6366f1', description: 'Color hexadecimal' })
  @IsString()
  @IsOptional()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { message: 'color debe ser un color hex válido' })
  color?: string;
}
