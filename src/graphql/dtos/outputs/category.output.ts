import { Field, ObjectType } from 'type-graphql';
import { CategoryModel } from '@/graphql/models/category.model.js';

@ObjectType()
export class CategoryListOutput {
  @Field(() => [CategoryModel])
  items!: CategoryModel[];
}
