import Range from "semver/classes/range";
import valid from "semver/functions/valid";
import validRange from "semver/ranges/valid";

export function asRange(s: string): Range {
    if (valid(s)) {
      return new Range('>=' + s);
    } else if (validRange(s)) {
      return new Range(s);
    } else {
      throw new Error(`Invalid range: ${s}`);
    }
  }