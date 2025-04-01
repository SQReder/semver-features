import { beforeEach, describe, expect, it } from "vitest";
import { asRange } from "../utils/asRange";
import { UrlParamsSource } from "./UrlParamsSource";

describe("UrlParamsSource", () => {
  beforeEach(() => {
    // Mock window.location.search
    Object.defineProperty(window, "location", {
      value: { search: "" },
      writable: true,
      configurable: true,
    });
  });

  describe("constructor and prefix behavior", () => {
    it("should use default prefix for URL parameters", () => {
      window.location.search = "?feature.test=true";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toBe(true);
    });

    it("should use custom prefix when provided", () => {
      window.location.search = "?custom.test=true";
      const source = new UrlParamsSource({ prefix: "custom." });
      const result = source.getFeatureState("test");

      expect(result).toBe(true);
    });
  });

  describe("getFeatureState", () => {
    it("should handle boolean true values", () => {
      window.location.search = "?feature.test=true";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toBe(true);
    });

    it("should handle boolean false values", () => {
      window.location.search = "?feature.test=false";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toBe(false);
    });

    it("should handle semver values", () => {
      window.location.search = "?feature.test=1.2.3";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toEqual("1.2.3");
    });

    it("should return undefined for invalid values", () => {
      window.location.search = "?feature.test=invalid";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toBe("invalid");
    });

    it("should return undefined when parameter is not present", () => {
      window.location.search = "?other=value";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toBeUndefined();
    });

    it("should return undefined when parameter value is empty", () => {
      window.location.search = "?feature.test=";
      const source = new UrlParamsSource();
      const result = source.getFeatureState("test");

      expect(result).toBe('');
    });
  });
});
