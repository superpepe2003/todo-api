import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, ParseIntPipe, Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AddProgressDto } from './dto/add-progress.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ok, created } from '../common/response.helper';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('appId') appId?: string,
    @Query('status') status?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    const filters = {
      appId: appId ? parseInt(appId) : undefined,
      status,
      assignedToId: assignedToId ? parseInt(assignedToId) : undefined,
    };
    const data = await this.tasksService.findAll(filters, user.id, user.role);
    return ok(data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tasksService.findOne(id);
    return ok(data);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    const data = await this.tasksService.create(dto, user.id);
    return created(data, 'Tarea creada');
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    const data = await this.tasksService.update(id, dto);
    return ok(data, 'Tarea actualizada');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
    return ok(null, 'Tarea eliminada');
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tasksService.cancel(id);
    return ok(data, 'Tarea cancelada');
  }

  @Post(':id/progress')
  async addProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProgressDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.tasksService.addProgress(id, user.id, dto, user.role);
    return created(data, 'Progreso registrado');
  }

  @Get(':id/progress')
  async getProgress(@Param('id', ParseIntPipe) id: number) {
    const data = await this.tasksService.getProgress(id);
    return ok(data);
  }
}
