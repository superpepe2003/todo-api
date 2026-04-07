import { IsInt, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProgressDto {
  @ApiProperty({ example: 75, description: 'Porcentaje de avance (0-100)', minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({ example: 'Se completó la integración con la base de datos y los tests unitarios' })
  @IsString()
  detail: string;
}
