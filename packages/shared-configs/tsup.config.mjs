import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  dts: true,
  // splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "esnext",
  outDir: "dist",
});
