import type { DashboardSummaryOutput } from '@/graphql/dtos/outputs/summary.output.js';
import { prismaClient } from '@/lib/prisma.js';

function monthRange(month: number, year: number): { gte: Date; lt: Date } {
  if (month < 1 || month > 12) throw new Error('Invalid month');
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  return { gte: start, lt: end };
}

export class SummaryService {
  private requireUser(userId: string | undefined): string {
    if (!userId) throw new Error('Unauthorized');
    return userId;
  }

  async dashboard(
    userId: string | undefined,
    month: number,
    year: number,
  ): Promise<DashboardSummaryOutput> {
    const uid = this.requireUser(userId);
    const { gte, lt } = monthRange(month, year);

    const [incomeAll, expenseAll, incomeMonth, expenseMonth] =
      await Promise.all([
        prismaClient.transaction.aggregate({
          where: { userId: uid, type: 'INCOME' },
          _sum: { amountCents: true },
        }),
        prismaClient.transaction.aggregate({
          where: { userId: uid, type: 'EXPENSE' },
          _sum: { amountCents: true },
        }),
        prismaClient.transaction.aggregate({
          where: { userId: uid, type: 'INCOME', date: { gte, lt } },
          _sum: { amountCents: true },
        }),
        prismaClient.transaction.aggregate({
          where: { userId: uid, type: 'EXPENSE', date: { gte, lt } },
          _sum: { amountCents: true },
        }),
      ]);

    const incomeAllCents = incomeAll._sum.amountCents ?? 0;
    const expenseAllCents = expenseAll._sum.amountCents ?? 0;

    return {
      balanceCents: incomeAllCents - expenseAllCents,
      incomeMonthCents: incomeMonth._sum.amountCents ?? 0,
      expenseMonthCents: expenseMonth._sum.amountCents ?? 0,
    };
  }
}
