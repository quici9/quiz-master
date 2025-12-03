import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: { select: { quizzes: true } },
      },
      orderBy: { name: 'asc' },
    });
    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { quizzes: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    // Check if slug already exists
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
      },
    });

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const updateData: any = {};

    if (dto.name) {
      const slug = slugify(dto.name, { lower: true, strict: true });
      
      // Check if new slug conflicts with another category
      const existing = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Category with this name already exists');
      }

      updateData.name = dto.name;
      updateData.slug = slug;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has quizzes
    const quizCount = await this.prisma.quiz.count({
      where: { categoryId: id },
    });

    if (quizCount > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${quizCount} existing quiz(zes)`,
      );
    }

    await this.prisma.category.delete({ where: { id } });

    return { message: 'Category deleted successfully' };
  }
}

