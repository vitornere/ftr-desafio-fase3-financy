import { Field, GraphQLISODateTime, ID, Int, ObjectType } from 'type-graphql';
import { TransactionType } from '@/graphql/enums/transaction-type.enum.js';
import { CategoryModel } from '@/graphql/models/category.model.js';

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  description!: string;

  // value in cents (ex: R$ 89,50 => 8950)
  @Field(() => Int)
  amountCents!: number;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  // optional: only fill if the resolver makes include/join
  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel | null;
}
