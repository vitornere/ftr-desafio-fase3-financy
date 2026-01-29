import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class SeedDevDataInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Month (1-12) for transactions. Defaults to current month.',
  })
  month?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Year for transactions. Defaults to current year.',
  })
  year?: number;

  @Field(() => Int, {
    defaultValue: 10,
    description: 'Number of categories to create (max 10).',
  })
  categoriesCount?: number;

  @Field(() => Int, {
    defaultValue: 80,
    description: 'Number of transactions to create (max 200).',
  })
  transactionsCount?: number;

  @Field(() => Boolean, {
    defaultValue: false,
    description:
      'If true, deletes existing categories and transactions before seeding.',
  })
  clearExisting?: boolean;
}
