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
import { DeleteByIdInput } from '@/graphql/dtos/inputs/common.input.js';
import {
  CreateTransactionInput,
  PaginationInput,
  TransactionFiltersInput,
  UpdateTransactionInput,
} from '@/graphql/dtos/inputs/transaction.input.js';
import { TransactionListOutput } from '@/graphql/dtos/outputs/transaction.output.js';
import { CategoryModel } from '@/graphql/models/category.model.js';
import { TransactionModel } from '@/graphql/models/transaction.model.js';
import { UserModel } from '@/graphql/models/user.model.js';
import { IsAuth } from '@/middlewares/auth.middleware.js';
import { CategoryService } from '@/services/category.service.js';
import { TransactionService } from '@/services/transaction.service.js';
import { UserService } from '@/services/user.service.js';

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {
    this.transactionService = new TransactionService();
    this.categoryService = new CategoryService();
    this.userService = new UserService();
  }

  @Query(() => TransactionListOutput)
  async transactions(
    @GqlUser() user: UserModel,
    @Arg('filters', () => TransactionFiltersInput, { nullable: true })
    filters?: TransactionFiltersInput,
    @Arg('pagination', () => PaginationInput, { nullable: true })
    pagination?: PaginationInput,
  ): Promise<TransactionListOutput> {
    return this.transactionService.list(user.id, filters, pagination);
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @GqlUser() user: UserModel,
    @Arg('input', () => CreateTransactionInput) input: CreateTransactionInput,
  ): Promise<TransactionModel> {
    return this.transactionService.create(user.id, input);
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @GqlUser() user: UserModel,
    @Arg('input', () => UpdateTransactionInput) input: UpdateTransactionInput,
  ): Promise<TransactionModel> {
    return this.transactionService.update(user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @GqlUser() user: UserModel,
    @Arg('input', () => DeleteByIdInput) input: DeleteByIdInput,
  ): Promise<boolean> {
    return this.transactionService.delete(user.id, input.id);
  }

  @FieldResolver(() => CategoryModel, { nullable: true })
  async category(@Root() tx: TransactionModel): Promise<CategoryModel | null> {
    if (!tx.categoryId) return null;

    return this.categoryService.getById(tx.userId, tx.categoryId);
  }

  @FieldResolver(() => UserModel)
  async user(@Root() tx: TransactionModel): Promise<UserModel> {
    return this.userService.getUser(tx.userId);
  }
}
