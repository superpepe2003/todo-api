import { IsString, IsOptional } from 'class-validator';

export class CreateAppDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
