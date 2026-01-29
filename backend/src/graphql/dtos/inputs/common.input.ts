import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteByIdInput {
  @Field(() => ID)
  id!: string;
}
