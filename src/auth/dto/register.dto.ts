import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email único del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mín. 6 caracteres)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
