import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/graphql/dtos/inputs/category.input.js';
import type { CategoryListOutput } from '@/graphql/dtos/outputs/category.output.js';
import type { CategoryModel } from '@/graphql/models/category.model.js';
import { prismaClient } from '@/lib/prisma.js';

export class CategoryService {
  private requireUser(userId: string | undefined): string {
    if (!userId) throw new Error('Unauthorized');
    return userId;
  }

  async getById(
    userId: string,
    categoryId: string,
  ): Promise<CategoryModel | null> {
    const uid = this.requireUser(userId);
    const category = await prismaClient.category.findUnique({
      where: { id: categoryId, userId: uid },
    });

    if (!category) throw new Error('Category not found');

    return {
      id: category.id,
      userId: category.userId,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(
    userId: string | undefined,
    data: CreateCategoryInput,
  ): Promise<CategoryModel> {
    const uid = this.requireUser(userId);

    const category = await prismaClient.category.create({
      data: {
        userId: uid,
        title: data.title,
        description: data.description ?? null,
        icon: data.icon,
        color: data.color,
      },
    });

    return {
      id: category.id,
      userId: category.userId,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async update(
    userId: string | undefined,
    data: UpdateCategoryInput,
  ): Promise<CategoryModel> {
    const uid = this.requireUser(userId);

    const existing = await prismaClient.category.findFirst({
      where: { id: data.id, userId: uid },
      select: { id: true },
    });

    if (!existing) throw new Error('Category not found');

    const category = await prismaClient.category.update({
      where: { id: data.id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        icon: data.icon ?? undefined,
        color: data.color ?? undefined,
      },
    });

    return {
      id: category.id,
      userId: category.userId,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async delete(
    userId: string | undefined,
    categoryId: string,
  ): Promise<boolean> {
    const uid = this.requireUser(userId);

    const existing = await prismaClient.category.findFirst({
      where: { id: categoryId, userId: uid },
      select: { id: true },
    });

    if (!existing) throw new Error('Category not found');

    await prismaClient.category.delete({ where: { id: categoryId } });

    return true;
  }

  async list(userId: string | undefined): Promise<CategoryListOutput> {
    const uid = this.requireUser(userId);

    const categories = await prismaClient.category.findMany({
      where: { userId: uid },
      orderBy: { createdAt: 'desc' },
    });

    return {
      items: categories.map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        description: c.description,
        icon: c.icon,
        color: c.color,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    };
  }
}
