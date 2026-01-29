import { Arg, Int, Query, Resolver, UseMiddleware } from 'type-graphql';
import { GqlUser } from '@/graphql/decorators/user.decorator.js';
import { DashboardSummaryOutput } from '@/graphql/dtos/outputs/summary.output.js';
import type { UserModel } from '@/graphql/models/user.model.js';
import { IsAuth } from '@/middlewares/auth.middleware.js';
import { SummaryService } from '@/services/summary.service.js';

@Resolver()
@UseMiddleware(IsAuth)
export class SummaryResolver {
  constructor(private readonly summaryService: SummaryService) {
    this.summaryService = new SummaryService();
  }

  @Query(() => DashboardSummaryOutput)
  async dashboardSummary(
    @GqlUser() user: UserModel,
    @Arg('month', () => Int) month: number,
    @Arg('year', () => Int) year: number,
  ): Promise<DashboardSummaryOutput> {
    return this.summaryService.dashboard(user.id, month, year);
  }
}
