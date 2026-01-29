import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/graphql/**"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: { includeDirectives: true },
    },
  },
};

export default config;