import "dotenv/config";
import "reflect-metadata";

import Fastify from "fastify";
import cors from "@fastify/cors";

import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello-resolver.js";

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  const schema = await buildSchema({
    resolvers: [HelloResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  });

  const server = new ApolloServer({
    schema,
    plugins: [fastifyApolloDrainPlugin(app)],
  });

  await server.start();

  await app.register(fastifyApollo(server), {
    // path: "/graphql", // the default path is /graphql
    // context: buildContext,
  });

  await app.listen({ port: 4000, host: "0.0.0.0" });
  console.log("Server is running on port 4000");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});