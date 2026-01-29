import type { SeedDevDataInput } from '@/graphql/dtos/inputs/seed.input.js';
import type { SeedDevDataOutput } from '@/graphql/dtos/outputs/seed.output.js';
import { TransactionType } from '@/graphql/enums/transaction-type.enum.js';
import { prismaClient } from '@/lib/prisma.js';

/**
 * Fixed pool of categories with stable data for a good-looking UI.
 * Uses expense-like and income-like categories.
 */
const CATEGORY_POOL = [
  { title: 'Alimentação', color: '#2563EB', icon: 'food', type: 'expense' },
  { title: 'Transporte', color: '#9333EA', icon: 'transport', type: 'expense' },
  { title: 'Mercado', color: '#EA580C', icon: 'market', type: 'expense' },
  {
    title: 'Investimento',
    color: '#16A34A',
    icon: 'investment',
    type: 'income',
  },
  { title: 'Utilidades', color: '#CA8A04', icon: 'utilities', type: 'expense' },
  { title: 'Salário', color: '#059669', icon: 'salary', type: 'income' },
  {
    title: 'Entretenimento',
    color: '#DB2777',
    icon: 'entertainment',
    type: 'expense',
  },
  { title: 'Saúde', color: '#DC2626', icon: 'health', type: 'expense' },
  { title: 'Educação', color: '#4F46E5', icon: 'education', type: 'expense' },
  { title: 'Casa', color: '#0F766E', icon: 'home', type: 'expense' },
] as const;

/**
 * Transaction descriptions pool for realistic data.
 */
const EXPENSE_DESCRIPTIONS = [
  'Jantar no restaurante',
  'Posto de gasolina',
  'Compras no mercado',
  'Cinema com amigos',
  'Assinatura streaming',
  'Farmácia',
  'Aluguel mensal',
  'Conta de luz',
  'Conta de água',
  'Internet',
  'Uber/99',
  'Academia',
  'Médico',
  'Dentista',
  'Livros',
  'Curso online',
  'Manutenção carro',
  'Estacionamento',
  'Café da manhã',
  'Almoço trabalho',
  'Roupas',
  'Presente',
  'Supermercado',
  'Padaria',
  'Delivery',
];

const INCOME_DESCRIPTIONS = [
  'Salário mensal',
  'Freelance projeto',
  'Dividendos',
  'Rendimento investimento',
  'Bônus trimestral',
  'Cashback',
  'Venda de item usado',
  'Restituição IR',
  'Comissão',
  'Consultoria',
];

/**
 * Get a random integer between min and max (inclusive).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random element from an array.
 */
function randomElement<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * Get random date within a month.
 */
function randomDateInMonth(year: number, month: number): Date {
  // Get last day of month
  const lastDay = new Date(year, month, 0).getDate();
  const day = randomInt(1, lastDay);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
}

export class SeedService {
  private requireUser(userId: string | undefined): string {
    if (!userId) throw new Error('Unauthorized');
    return userId;
  }

  /**
   * Seed development data for the authenticated user.
   * Creates categories and transactions with realistic fake data.
   *
   * @param userId - Authenticated user ID
   * @param input - Seed configuration options
   * @returns Count of created categories and transactions
   */
  async seedDevData(
    userId: string | undefined,
    input: SeedDevDataInput,
  ): Promise<SeedDevDataOutput> {
    const uid = this.requireUser(userId);

    // Default to current month/year if not provided
    const now = new Date();
    const targetMonth = input.month ?? now.getMonth() + 1;
    const targetYear = input.year ?? now.getFullYear();

    // Clamp counts to reasonable limits
    const categoriesCount = Math.min(
      Math.max(input.categoriesCount ?? 10, 1),
      10,
    );
    const transactionsCount = Math.min(
      Math.max(input.transactionsCount ?? 80, 1),
      200,
    );

    // Clear existing data if requested
    if (input.clearExisting) {
      await prismaClient.transaction.deleteMany({ where: { userId: uid } });
      await prismaClient.category.deleteMany({ where: { userId: uid } });
    }

    // =========================================================================
    // Create Categories
    // =========================================================================

    // Get existing categories for this user (by title) to avoid duplicates
    const existingCategories = await prismaClient.category.findMany({
      where: { userId: uid },
      select: { id: true, title: true },
    });
    const existingTitles = new Set(existingCategories.map((c) => c.title));

    // Filter out categories that already exist
    const categoriesToCreate = CATEGORY_POOL.slice(0, categoriesCount).filter(
      (cat) => !existingTitles.has(cat.title),
    );

    // Bulk create new categories
    let categoriesCreated = 0;
    if (categoriesToCreate.length > 0) {
      const result = await prismaClient.category.createMany({
        data: categoriesToCreate.map((cat) => ({
          userId: uid,
          title: cat.title,
          color: cat.color,
          icon: cat.icon,
          description: null,
        })),
      });
      categoriesCreated = result.count;
    }

    // Get all categories (including newly created) for transaction assignment
    const allCategories = await prismaClient.category.findMany({
      where: { userId: uid },
      select: { id: true, title: true },
    });

    // Map category titles to IDs
    const categoryByTitle = new Map(allCategories.map((c) => [c.title, c.id]));

    // Separate into expense and income categories
    const expenseCategories = CATEGORY_POOL.filter(
      (c) => c.type === 'expense' && categoryByTitle.has(c.title),
    );
    const incomeCategories = CATEGORY_POOL.filter(
      (c) => c.type === 'income' && categoryByTitle.has(c.title),
    );

    // =========================================================================
    // Create Transactions
    // =========================================================================

    // Generate transactions with ~70% expenses, ~30% income
    const transactions: Array<{
      userId: string;
      type: TransactionType;
      description: string;
      amountCents: number;
      date: Date;
      categoryId: string | null;
    }> = [];

    for (let i = 0; i < transactionsCount; i++) {
      const isExpense = Math.random() < 0.7;

      if (isExpense) {
        // Expense transaction
        const description = randomElement(EXPENSE_DESCRIPTIONS);
        const amountCents = randomInt(500, 30000); // R$ 5.00 - R$ 300.00
        const date = randomDateInMonth(targetYear, targetMonth);

        // Assign category if we have expense categories
        let categoryId: string | null = null;
        if (expenseCategories.length > 0) {
          const cat = randomElement(expenseCategories);
          categoryId = categoryByTitle.get(cat.title) ?? null;
        }

        transactions.push({
          userId: uid,
          type: TransactionType.EXPENSE,
          description,
          amountCents,
          date,
          categoryId,
        });
      } else {
        // Income transaction
        const description = randomElement(INCOME_DESCRIPTIONS);
        const amountCents = randomInt(5000, 400000); // R$ 50.00 - R$ 4,000.00
        const date = randomDateInMonth(targetYear, targetMonth);

        // Assign category if we have income categories
        let categoryId: string | null = null;
        if (incomeCategories.length > 0) {
          const cat = randomElement(incomeCategories);
          categoryId = categoryByTitle.get(cat.title) ?? null;
        }

        transactions.push({
          userId: uid,
          type: TransactionType.INCOME,
          description,
          amountCents,
          date,
          categoryId,
        });
      }
    }

    // Bulk create transactions
    const txResult = await prismaClient.transaction.createMany({
      data: transactions,
    });

    return {
      categoriesCreated,
      transactionsCreated: txResult.count,
    };
  }
}
