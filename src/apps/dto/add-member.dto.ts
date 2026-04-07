import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({ example: 2, description: 'ID del usuario a agregar como miembro' })
  @IsInt()
  userId: number;
}
