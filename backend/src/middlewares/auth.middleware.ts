import type { MiddlewareFn } from 'type-graphql';
import type { GraphQLContext } from '@/graphql/context/index.js';

export const IsAuth: MiddlewareFn<GraphQLContext> = async (
  { context },
  next,
) => {
  if (!context.user) {
    throw new Error('Not authenticated');
  }

  return next();
};
