import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { GqlUser } from '@/graphql/decorators/user.decorator.js';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/graphql/dtos/inputs/category.input.js';
import { DeleteByIdInput } from '@/graphql/dtos/inputs/common.input.js';
import { CategoryListOutput } from '@/graphql/dtos/outputs/category.output.js';
import { CategoryModel } from '@/graphql/models/category.model.js';
import { UserModel } from '@/graphql/models/user.model.js';
import { prismaClient } from '@/lib/prisma.js';
import { IsAuth } from '@/middlewares/auth.middleware.js';
import { CategoryService } from '@/services/category.service.js';
import { UserService } from '@/services/user.service.js';

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {
    this.categoryService = new CategoryService();
    this.userService = new UserService();
  }

  @Query(() => CategoryListOutput)
  async categories(@GqlUser() user: UserModel): Promise<CategoryListOutput> {
    return this.categoryService.list(user.id);
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @GqlUser() user: UserModel,
    @Arg('input', () => CreateCategoryInput) input: CreateCategoryInput,
  ): Promise<CategoryModel> {
    return this.categoryService.create(user.id, input);
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @GqlUser() user: UserModel,
    @Arg('input', () => UpdateCategoryInput) input: UpdateCategoryInput,
  ): Promise<CategoryModel> {
    return this.categoryService.update(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @GqlUser() user: UserModel,
    @Arg('input', () => DeleteByIdInput) input: DeleteByIdInput,
  ): Promise<boolean> {
    return this.categoryService.delete(user.id, input.id);
  }

  @FieldResolver(() => Number)
  async transactionCount(@Root() category: CategoryModel): Promise<number> {
    return prismaClient.transaction.count({
      where: { categoryId: category.id },
    });
  }

  @FieldResolver(() => UserModel)
  async user(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.getUser(category.userId);
  }
}
