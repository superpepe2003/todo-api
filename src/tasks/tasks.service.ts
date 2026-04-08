import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AddProgressDto } from './dto/add-progress.dto';
import { TaskStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

function addBusinessDays(startDate: Date, days: number): Date {
  const date = new Date(startDate);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const dow = date.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return date;
}

function deriveStatus(progress: number, currentStatus: TaskStatus): TaskStatus {
  if (currentStatus === TaskStatus.CANCELLED) return TaskStatus.CANCELLED;
  if (progress === 0) return TaskStatus.PENDING;
  if (progress === 100) return TaskStatus.COMPLETED;
  return TaskStatus.IN_PROGRESS;
}

function attachIsOverdue(task: any): any {
  const isOverdue =
    task.deadline &&
    new Date() > new Date(task.deadline) &&
    !['COMPLETED', 'CANCELLED'].includes(task.status);
  return { ...task, isOverdue: !!isOverdue };
}

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(filters: { appId?: number; status?: string; assignedToId?: number; categoryId?: number }, userId: number, role: string) {
    const where: any = {};
    if (filters.appId) where.appId = filters.appId;
    if (filters.status) where.status = filters.status;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.categoryId) where.app = { categoryId: filters.categoryId };
    if (role !== 'ADMIN') where.assignedToId = userId;

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        app: { select: { id: true, name: true, categoryId: true } },
      },
      orderBy: [{ priority: 'desc' }, { deadline: 'asc' }],
    });

    const result = tasks.map(attachIsOverdue);

    // Notificar tareas vencidas
    for (const task of result) {
      if (task.isOverdue && task.assignedToId) {
        await this.notificationsService.notifyOverdueIfNeeded(task.id, task.assignedToId, task.title);
      }
    }

    return result;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        app: { select: { id: true, name: true, categoryId: true } },
        progressLogs: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return attachIsOverdue(task);
  }

  async create(dto: CreateTaskDto, createdById: number) {
    let deadline: Date | undefined;
    if (dto.deadlineDays) {
      deadline = addBusinessDays(new Date(), dto.deadlineDays);
    } else if (dto.deadline) {
      deadline = new Date(dto.deadline);
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        appId: dto.appId,
        assignedToId: dto.assignedToId,
        createdById,
        deadlineDays: dto.deadlineDays,
        deadline,
        priority: dto.priority ?? 3,
      },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);

    let deadline: Date | undefined;
    const data: any = { ...dto };

    if (dto.deadlineDays) {
      deadline = addBusinessDays(new Date(), dto.deadlineDays);
      data.deadline = deadline;
    } else if (dto.deadline) {
      data.deadline = new Date(dto.deadline);
    }

    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }

  async cancel(id: number) {
    const task = await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { status: TaskStatus.CANCELLED },
    });
  }

  async addProgress(taskId: number, userId: number, dto: AddProgressDto, role: string) {
    const task = await this.findOne(taskId);

    if (role !== 'ADMIN' && task.assignedToId !== userId) {
      throw new ForbiddenException('No tenés permiso para actualizar esta tarea');
    }

    // Acumular progreso: cada entrada suma al total, sin superar 100
    const accumulated = Math.min(task.progress + dto.percentage, 100);
    const newStatus = deriveStatus(accumulated, task.status);

    const [progressLog] = await this.prisma.$transaction([
      this.prisma.taskProgress.create({
        data: { taskId, userId, percentage: dto.percentage, detail: dto.detail },
      }),
      this.prisma.task.update({
        where: { id: taskId },
        data: { progress: accumulated, status: newStatus },
      }),
    ]);

    return progressLog;
  }

  async getProgress(taskId: number) {
    await this.findOne(taskId);
    return this.prisma.taskProgress.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
