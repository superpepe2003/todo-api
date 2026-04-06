import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class AppsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, role: string) {
    if (role === 'ADMIN') {
      return this.prisma.app.findMany({ include: { members: true, tasks: true } });
    }
    return this.prisma.app.findMany({
      where: { members: { some: { userId } } },
      include: { members: true, tasks: true },
    });
  }

  async findOne(id: number) {
    const app = await this.prisma.app.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
        tasks: { include: { assignedTo: { select: { id: true, name: true } } } },
      },
    });
    if (!app) throw new NotFoundException('Aplicación no encontrada');
    return app;
  }

  async create(dto: CreateAppDto) {
    return this.prisma.app.create({ data: dto });
  }

  async update(id: number, dto: UpdateAppDto) {
    await this.findOne(id);
    return this.prisma.app.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.app.delete({ where: { id } });
  }

  async addMember(appId: number, userId: number) {
    const existing = await this.prisma.appMember.findUnique({
      where: { appId_userId: { appId, userId } },
    });
    if (existing) throw new ConflictException('El usuario ya es miembro');
    return this.prisma.appMember.create({ data: { appId, userId } });
  }

  async removeMember(appId: number, userId: number) {
    const existing = await this.prisma.appMember.findUnique({
      where: { appId_userId: { appId, userId } },
    });
    if (!existing) throw new NotFoundException('El usuario no es miembro');
    await this.prisma.appMember.delete({ where: { appId_userId: { appId, userId } } });
  }
}
