import { Options } from "tsup";

type MaybePromise<T> = T | Promise<T>;

const options:
  | Options
  | Options[]
  | ((overrideOptions: Options) => MaybePromise<Options | Options[]>);

  export default options;
