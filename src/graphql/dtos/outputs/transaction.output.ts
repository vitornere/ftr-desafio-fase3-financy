import { Field, Int, ObjectType } from 'type-graphql';
import { TransactionModel } from '@/graphql/models/transaction.model.js';

@ObjectType()
export class TransactionListOutput {
  @Field(() => [TransactionModel])
  items!: TransactionModel[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  perPage!: number;
}
