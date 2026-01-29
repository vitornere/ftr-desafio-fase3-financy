import 'dotenv/config';
import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { buildSchema } from 'type-graphql';
import { buildContext, type GraphQLContext } from './graphql/context/index.js';
import { AuthResolver } from './resolvers/auth.resolver.js';
import { CategoryResolver } from './resolvers/category.resolver.js';
import { SummaryResolver } from './resolvers/summary.resolver.js';
import { TransactionResolver } from './resolvers/transaction.resolver.js';
import { UserResolver } from './resolvers/user.resolver.js';

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  const schema = await buildSchema({
    resolvers: [
      SummaryResolver,
      TransactionResolver,
      CategoryResolver,
      AuthResolver,
      UserResolver,
    ],
    validate: false,
    emitSchemaFile: './schema.graphql',
  });

  const server = new ApolloServer<GraphQLContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(app)],
  });

  await server.start();

  await app.register(fastifyApollo(server), {
    context: buildContext,
  });

  await app.listen({ port: 4000, host: '0.0.0.0' });
  console.log('Server is running on port 4000');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
