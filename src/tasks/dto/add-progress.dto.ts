import { IsInt, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProgressDto {
  @ApiProperty({ example: 10, description: 'Porcentaje a sumar al avance actual (1-100). El total nunca supera 100.', minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  percentage: number;

  @ApiProperty({ example: 'Se completó la integración con la base de datos y los tests unitarios' })
  @IsString()
  detail: string;
}
