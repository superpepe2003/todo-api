import { IsInt, IsString, Min, Max } from 'class-validator';

export class AddProgressDto {
  @IsInt()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsString()
  detail: string;
}
