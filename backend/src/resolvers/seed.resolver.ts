import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { GqlUser } from '@/graphql/decorators/user.decorator.js';
import { SeedDevDataInput } from '@/graphql/dtos/inputs/seed.input.js';
import { SeedDevDataOutput } from '@/graphql/dtos/outputs/seed.output.js';
import type { UserModel } from '@/graphql/models/user.model.js';
import { config } from '@/lib/config.js';
import { IsAuth } from '@/middlewares/auth.middleware.js';
import { SeedService } from '@/services/seed.service.js';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {
    this.seedService = new SeedService();
  }

  /**
   * Query to check if dev seed feature is enabled.
   * Returns false in production regardless of env var.
   */
  @Query(() => Boolean, {
    description: 'Check if the dev seed feature is enabled.',
  })
  isDevSeedEnabled(): boolean {
    return config.devSeedEnabled;
  }

  /**
   * Mutation to seed development data for the authenticated user.
   *
   * Guards:
   * - User must be authenticated
   * - DEV_SEED_ENABLED must be true
   * - Environment must NOT be production
   *
   * Creates categories and transactions with realistic fake data.
   * Uses bulk operations for performance.
   */
  @Mutation(() => SeedDevDataOutput, {
    description:
      'DEV ONLY: Seed fake categories and transactions for the authenticated user.',
  })
  @UseMiddleware(IsAuth)
  async seedDevData(
    @GqlUser() user: UserModel,
    @Arg('input', () => SeedDevDataInput) input: SeedDevDataInput,
  ): Promise<SeedDevDataOutput> {
    // Guard: Production always rejects
    if (config.isProduction) {
      throw new Error('Dev seed is not available in production');
    }

    // Guard: Feature must be enabled
    if (!config.devSeedEnabled) {
      throw new Error('Dev seed feature is disabled');
    }

    return this.seedService.seedDevData(user.id, input);
  }
}
