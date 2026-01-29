import { createParameterDecorator, type ResolverData } from 'type-graphql';
import type { User } from '@/generated/prisma/client.js';
import { prismaClient } from '@/lib/prisma.js';
import type { GraphQLContext } from '../context/index.js';

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphQLContext>): Promise<User | null> => {
      if (!context?.user) {
        return null;
      }

      try {
        const user = await prismaClient.user.findUnique({
          where: { id: context.user },
        });

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to get user');
      }
    },
  );
};
