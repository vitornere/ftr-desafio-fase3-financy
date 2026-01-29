import { Ctx, Query, Resolver } from 'type-graphql';
import type { GraphQLContext } from '@/graphql/context/index.js';
import { UserModel } from '@/graphql/models/user.model.js';
import { UserService } from '@/services/user.service.js';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {
    this.userService = new UserService();
  }

  /**
   * Get the currently authenticated user.
   * Returns null if not authenticated (no middleware protection).
   */
  @Query(() => UserModel, { nullable: true })
  async userMe(@Ctx() ctx: GraphQLContext): Promise<UserModel | null> {
    if (!ctx.user) {
      return null;
    }

    try {
      return await this.userService.getUser(ctx.user);
    } catch {
      // User not found in database (deleted, etc.)
      return null;
    }
  }
}
