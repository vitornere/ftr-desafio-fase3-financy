import { defineConfig } from "tsup";
import { tsconfigPathsPlugin } from "esbuild-plugin-tsconfig-paths";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  platform: "node",
  target: "es2022",

  sourcemap: true,
  clean: true,

  // To API, it's recommended to bundle to avoid pain with ESM imports (.js), index, etc.
  // (when bundle=false, it's common to get imports without extension and broken aliases)
  bundle: true,
  splitting: false,
  treeshake: true,
  minify: false,

  esbuildPlugins: [
    tsconfigPathsPlugin({
      tsconfig: "tsconfig.json",
    }),
  ],

  // Prisma + native addons are better as external
  external: ["@prisma/client", ".prisma/client", "better-sqlite3"],
});