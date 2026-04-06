import { IsString, IsOptional } from 'class-validator';

export class UpdateAppDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
