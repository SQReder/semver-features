import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  format: ["esm"],
  dts: true,
  // splitting: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "esnext",
  outDir: "dist",
  ...options,
}));
