import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      include: { task: { select: { id: true, title: true } } },
    });
  }

  async markRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async notifyOverdueIfNeeded(taskId: number, userId: number, taskTitle: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await this.prisma.notification.findFirst({
      where: {
        taskId,
        userId,
        read: false,
        createdAt: { gte: since },
        message: { contains: 'vencida' },
      },
    });
    if (!existing) {
      await this.prisma.notification.create({
        data: {
          userId,
          taskId,
          message: `La tarea "${taskTitle}" está vencida. Por favor actualizá el progreso.`,
        },
      });
    }
  }
}
