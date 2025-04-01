import { Options } from "tsup";

type MaybePromise<T> = T | Promise<T>;

const options: (overrideOptions: Options) => MaybePromise<Options>;

export default options;
