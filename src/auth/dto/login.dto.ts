import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@taskmanager.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Contraseña (mín. 6 caracteres)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
