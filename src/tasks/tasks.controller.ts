import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AddProgressDto } from './dto/add-progress.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ok, created } from '../common/response.helper';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tareas con filtros opcionales' })
  @ApiQuery({ name: 'appId', required: false, description: 'Filtrar por aplicación' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)' })
  @ApiQuery({ name: 'assignedToId', required: false, description: 'Filtrar por usuario asignado' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filtrar por categoría de la app' })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  async findAll(
    @CurrentUser() user: any,
    @Query('appId') appId?: string,
    @Query('status') status?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters = {
      appId: appId ? parseInt(appId) : undefined,
      status,
      assignedToId: assignedToId ? parseInt(assignedToId) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    };
    const data = await this.tasksService.findAll(filters, user.id, user.role);
    return ok(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de tarea con historial de progreso' })
  @ApiResponse({ status: 200, description: 'Detalle de la tarea' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tasksService.findOne(id);
    return ok(data);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear tarea (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Tarea creada' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    const data = await this.tasksService.create(dto, user.id);
    return created(data, 'Tarea creada');
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Editar tarea (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    const data = await this.tasksService.update(id, dto);
    return ok(data, 'Tarea actualizada');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar tarea (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
    return ok(null, 'Tarea eliminada');
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cancelar tarea (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Tarea cancelada' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tasksService.cancel(id);
    return ok(data, 'Tarea cancelada');
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Registrar progreso de tarea (usuario asignado o admin)' })
  @ApiResponse({ status: 201, description: 'Progreso registrado' })
  @ApiResponse({ status: 403, description: 'Sin permiso para actualizar esta tarea' })
  async addProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProgressDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.tasksService.addProgress(id, user.id, dto, user.role);
    return created(data, 'Progreso registrado');
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Historial de progreso de una tarea' })
  @ApiResponse({ status: 200, description: 'Historial de progreso' })
  async getProgress(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tasksService.getProgress(id);
    return ok(data);
  }
}
