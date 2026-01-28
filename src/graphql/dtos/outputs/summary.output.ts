import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class DashboardSummaryOutput {
  @Field(() => Int, { description: 'Total balance in cents' })
  balanceCents!: number;

  @Field(() => Int, { description: 'Total income in cents' })
  incomeMonthCents!: number;

  @Field(() => Int, { description: 'Total expenses in cents' })
  expenseMonthCents!: number;
}
