import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppDto {
  @ApiPropertyOptional({ example: 'Portal de Clientes v2' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsString()
  @IsOptional()
  description?: string;
}
