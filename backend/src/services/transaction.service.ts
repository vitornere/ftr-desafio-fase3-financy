import type { Prisma } from '@/generated/prisma/client.js';
import type {
  CreateTransactionInput,
  PaginationInput,
  TransactionFiltersInput,
  UpdateTransactionInput,
} from '@/graphql/dtos/inputs/transaction.input.js';
import type { TransactionListOutput } from '@/graphql/dtos/outputs/transaction.output.js';
import type { TransactionType } from '@/graphql/enums/transaction-type.enum.js';
import type { TransactionModel } from '@/graphql/models/transaction.model.js';
import { prismaClient } from '@/lib/prisma.js';

function monthRange(month: number, year: number): { gte: Date; lt: Date } {
  if (month < 1 || month > 12) throw new Error('Invalid month');
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  return { gte: start, lt: end };
}

export class TransactionService {
  private requireUser(userId: string | undefined): string {
    if (!userId) throw new Error('Unauthorized');
    return userId;
  }

  private async assertCategoryOwnership(userId: string, categoryId: string) {
    const ok = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true },
    });
    if (!ok) throw new Error('Invalid category');
  }

  async create(
    userId: string | undefined,
    data: CreateTransactionInput,
  ): Promise<TransactionModel> {
    const uid = this.requireUser(userId);

    if (typeof data.categoryId === 'string') {
      await this.assertCategoryOwnership(uid, data.categoryId);
    }

    const tx = await prismaClient.transaction.create({
      data: {
        userId: uid,
        categoryId: data.categoryId ?? null,
        type: data.type,
        description: data.description,
        amountCents: data.amountCents,
        date: data.date,
      },
    });

    return {
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId ?? null,
      type: tx.type as TransactionType,
      description: tx.description,
      amountCents: tx.amountCents,
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    };
  }

  async update(
    userId: string | undefined,
    data: UpdateTransactionInput,
  ): Promise<TransactionModel> {
    const uid = this.requireUser(userId);

    const existing = await prismaClient.transaction.findFirst({
      where: { id: data.id, userId: uid },
      select: { id: true },
    });
    if (!existing) throw new Error('Transaction not found');

    if (typeof data.categoryId === 'string') {
      await this.assertCategoryOwnership(uid, data.categoryId);
    }

    const updateData: Record<string, unknown> = {
      type: data.type ?? undefined,
      description: data.description ?? undefined,
      amountCents: data.amountCents ?? undefined,
      date: data.date ?? undefined,
    };

    // permite setar NULL (sem categoria)
    if (Object.hasOwn(data, 'categoryId')) {
      updateData.categoryId = data.categoryId ?? null;
    }

    const tx = await prismaClient.transaction.update({
      where: { id: data.id },
      data: updateData,
    });

    return {
      id: tx.id,
      userId: tx.userId,
      categoryId: tx.categoryId ?? null,
      type: tx.type as TransactionType,
      description: tx.description,
      amountCents: tx.amountCents,
      date: tx.date,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    };
  }

  async delete(
    userId: string | undefined,
    transactionId: string,
  ): Promise<boolean> {
    const uid = this.requireUser(userId);

    const existing = await prismaClient.transaction.findFirst({
      where: { id: transactionId, userId: uid },
      select: { id: true },
    });
    if (!existing) throw new Error('Transaction not found');

    await prismaClient.transaction.delete({ where: { id: transactionId } });
    return true;
  }

  async list(
    userId: string | undefined,
    filters?: TransactionFiltersInput,
    pagination?: PaginationInput,
  ): Promise<TransactionListOutput> {
    const uid = this.requireUser(userId);

    const page = pagination?.page ?? 1;
    const perPage = pagination?.perPage ?? 10;
    const skip = (page - 1) * perPage;

    const where: Prisma.TransactionWhereInput = { userId: uid };

    if (filters?.type) where.type = filters.type;

    if (filters?.search?.trim()) {
      where.description = {
        contains: filters.search.trim(),
      };
    }

    if (filters && Object.hasOwn(filters, 'categoryId')) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.month && filters?.year) {
      const { gte, lt } = monthRange(filters.month, filters.year);
      where.date = { gte, lt };
    }

    const [total, items] = await Promise.all([
      prismaClient.transaction.count({ where }),
      prismaClient.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: perPage,
      }),
    ]);

    return {
      total,
      page,
      perPage,
      items: items.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        categoryId: tx.categoryId ?? null,
        type: tx.type as TransactionType,
        description: tx.description,
        amountCents: tx.amountCents,
        date: tx.date,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      })),
    };
  }
}
