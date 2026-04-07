import { Controller, Get, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateRoleDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ok } from '../common/response.helper';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async findAll() {
    const data = await this.usersService.findAll();
    return ok(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.findOne(id);
    return ok(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar usuario (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const data = await this.usersService.update(id, dto);
    return ok(data, 'Usuario actualizado');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return ok(null, 'Usuario eliminado');
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Cambiar rol de usuario (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    const data = await this.usersService.updateRole(id, dto);
    return ok(data, 'Rol actualizado');
  }
}
