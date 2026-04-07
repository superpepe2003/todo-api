import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Ya existe una categoría con ese nombre');
    return this.prisma.category.create({ data: { name: dto.name, color: dto.color ?? '#6366f1' } });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.category.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) throw new ConflictException('Ya existe una categoría con ese nombre');
    }
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    const appsCount = await this.prisma.app.count({ where: { categoryId: id } });
    if (appsCount > 0) {
      throw new BadRequestException(`No se puede eliminar: hay ${appsCount} app(s) asignada(s) a esta categoría`);
    }
    await this.prisma.category.delete({ where: { id } });
  }
}
