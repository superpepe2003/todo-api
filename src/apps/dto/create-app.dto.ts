import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppDto {
  @ApiProperty({ example: 'Portal de Clientes', description: 'Nombre de la aplicación' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Gestión del portal web para clientes externos' })
  @IsString()
  @IsOptional()
  description?: string;
}
