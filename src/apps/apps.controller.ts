import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ok, created } from '../common/response.helper';

@ApiTags('Apps')
@ApiBearerAuth()
@Controller('apps')
@UseGuards(JwtAuthGuard)
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar apps (admin: todas, user: sus apps)' })
  @ApiResponse({ status: 200, description: 'Lista de aplicaciones' })
  async findAll(@CurrentUser() user: any) {
    const data = await this.appsService.findAll(user.id, user.role);
    return ok(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de app con miembros y tareas' })
  @ApiResponse({ status: 200, description: 'Detalle de la aplicación' })
  @ApiResponse({ status: 404, description: 'Aplicación no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.appsService.findOne(id);
    return ok(data);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear aplicación (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Aplicación creada' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async create(@Body() dto: CreateAppDto) {
    const data = await this.appsService.create(dto);
    return created(data, 'Aplicación creada');
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Editar aplicación (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Aplicación actualizada' })
  @ApiResponse({ status: 404, description: 'Aplicación no encontrada' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppDto) {
    const data = await this.appsService.update(id, dto);
    return ok(data, 'Aplicación actualizada');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar aplicación (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Aplicación eliminada' })
  @ApiResponse({ status: 404, description: 'Aplicación no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.appsService.remove(id);
    return ok(null, 'Aplicación eliminada');
  }

  @Post(':id/members')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Agregar miembro a app (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Miembro agregado' })
  @ApiResponse({ status: 409, description: 'El usuario ya es miembro' })
  async addMember(@Param('id', ParseIntPipe) id: number, @Body() dto: AddMemberDto) {
    const data = await this.appsService.addMember(id, dto.userId);
    return created(data, 'Miembro agregado');
  }

  @Delete(':id/members/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Quitar miembro de app (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Miembro eliminado' })
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.appsService.removeMember(id, userId);
    return ok(null, 'Miembro eliminado');
  }
}
