import { Field, GraphQLISODateTime, ID, InputType, Int } from 'type-graphql';
import { TransactionType } from '@/graphql/enums/transaction-type.enum.js';

@InputType()
export class CreateTransactionInput {
  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  description!: string;

  @Field(() => Int)
  amountCents!: number;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => ID)
  id!: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  amountCents?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;
}

@InputType()
export class DeleteByIdInput {
  @Field(() => ID)
  id!: string;
}

@InputType()
export class TransactionFiltersInput {
  @Field(() => String, { nullable: true, description: 'Busca por descrição' })
  search?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => ID, {
    nullable: true,
    description: 'Filtrar por categoria (null = sem categoria)',
  })
  categoryId?: string | null;

  @Field(() => Int, { nullable: true })
  month?: number; // 1-12

  @Field(() => Int, { nullable: true })
  year?: number; // ex: 2025
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  perPage?: number;
}
