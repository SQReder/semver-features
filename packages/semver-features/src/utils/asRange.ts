import Range from "semver/classes/range";
import valid from "semver/functions/valid";
import validRange from "semver/ranges/valid";

export function tryAsRange(s: string): Range | false {
    if (valid(s)) {
      return new Range('>=' + s);
    } else if (validRange(s)) {
      return new Range(s);
    } else {
      console.warn(`Invalid semver version or range: ${s}`);
      return false;
    }
  }