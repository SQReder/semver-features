import sharedConfig from "@repo/tsup-config";

export default sharedConfig({
  entry: [
    "src/index.ts",
    "src/core.ts",
    "src/sources/local-storage.ts",
    "src/sources/session-storage.ts", 
    "src/sources/url-params.ts",
    "src/sources/async.ts"
  ],
});
