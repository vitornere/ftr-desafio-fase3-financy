import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  // selected icon key in UI (ex: "food", "car", etc.)
  @Field(() => String)
  icon!: string;

  // selected color key in UI (ex: "green" or "#16a34a")
  @Field(() => String)
  color!: string;

  // computed
  @Field(() => Number, { nullable: true })
  transactionCount?: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
