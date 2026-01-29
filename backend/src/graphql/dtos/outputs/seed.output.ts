import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class SeedDevDataOutput {
  @Field(() => Int, {
    description: 'Number of categories created.',
  })
  categoriesCreated!: number;

  @Field(() => Int, {
    description: 'Number of transactions created.',
  })
  transactionsCreated!: number;
}
