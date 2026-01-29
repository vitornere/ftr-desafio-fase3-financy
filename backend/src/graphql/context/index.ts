import type { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import { verifyJwt } from '@/utils/jwt.js';

export type GraphQLContext = {
  user: string | undefined;
  token: string | undefined;
};

export const buildContext: ApolloFastifyContextFunction<
  GraphQLContext
> = async (request, _): Promise<GraphQLContext> => {
  const rawAuth = request.headers.authorization;
  const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;

  const baseResponse = {
    user: undefined,
    token: undefined,
  };

  if (!authHeader?.startsWith('Bearer ')) {
    return baseResponse;
  }

  const token = authHeader.substring('Bearer '.length);

  if (!token) {
    return baseResponse;
  }

  try {
    const decoded = verifyJwt(token);
    return {
      ...baseResponse,
      user: decoded.id,
      token,
    };
  } catch (error) {
    console.error(error);
    return baseResponse;
  }
};
