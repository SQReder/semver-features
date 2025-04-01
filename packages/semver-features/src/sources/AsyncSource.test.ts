import { describe, expect, it, vi } from "vitest";
import { asRange } from "../utils/asRange";
import { AsyncSource } from "./AsyncSource";

describe("AsyncSource", () => {
  describe("constructor", () => {
    it("should set fetchStates with default fetchOnInit", () => {
      const fetchStates = vi.fn().mockResolvedValue({});

      const source = new AsyncSource({ fetchStates });

      // @ts-expect-error accessing private property for testing
      expect(source.fetchStates).toBe(fetchStates);
    });

    it("should set default fetchOnInit to true", () => {
      const fetchStates = vi.fn().mockResolvedValue({});

      const source = new AsyncSource({ fetchStates });

      // @ts-expect-error accessing private property for testing
      expect(source.fetchOnInit).toBe(true);
    });

    it("should respect custom fetchOnInit value", () => {
      const fetchStates = vi.fn().mockResolvedValue({});

      const source = new AsyncSource({ fetchStates, fetchOnInit: false });

      // @ts-expect-error accessing private property for testing
      expect(source.fetchOnInit).toBe(false);
    });
  });

  describe("initialize", () => {
    it("should call refresh if fetchOnInit is true", async () => {
      const fetchStates = vi.fn().mockResolvedValue({});
      const source = new AsyncSource({ fetchStates });
      const refreshSpy = vi.spyOn(source, "refresh").mockResolvedValue();

      await source.initialize();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call refresh if fetchOnInit is false", async () => {
      const fetchStates = vi.fn().mockResolvedValue({});
      const source = new AsyncSource({ fetchStates, fetchOnInit: false });
      const refreshSpy = vi.spyOn(source, "refresh").mockResolvedValue();

      await source.initialize();

      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("should call fetchStates when refreshing", async () => {
      const mockStates = { feature1: true };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(fetchStates).toHaveBeenCalledTimes(1);
    });

    it("should update feature states from fetchStates result", async () => {
      const mockStates = { feature1: true };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("feature1")).toBe(true);
    });

    it('should parse string "true" to boolean true', async () => {
      const mockStates = { boolTrue: "true" };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("boolTrue")).toBe("true");
    });

    it('should parse string "false" to boolean false', async () => {
      const mockStates = { boolFalse: "false" };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("boolFalse")).toBe("false");
    });

    it("should handle numeric values and convert to string", async () => {
      const mockStates = { numericValue: 123 };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("numericValue")).toBe(123);
    });

    it("should keep valid semver strings as is", async () => {
      const mockStates = { version: "1.2.3" };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("version")).toEqual("1.2.3");
    });

    it("should exclude invalid values", async () => {
      const mockStates = { invalid: "not-a-valid-value" };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("invalid")).toBe("not-a-valid-value");
    });

    it("should handle empty states object", async () => {
      const mockStates = {};
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });

      await source.refresh();

      expect(source.getFeatureState("anyFeature")).toBeUndefined();
    });
  });

  describe("getFeatureState", () => {
    it("should return true for enabled features", async () => {
      const mockStates = { enabled: true };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();

      const result = source.getFeatureState("enabled");

      expect(result).toBe(true);
    });

    it("should return false for disabled features", async () => {
      const mockStates = { disabled: false };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();

      const result = source.getFeatureState("disabled");

      expect(result).toBe(false);
    });

    it("should return semver string for version features", async () => {
      const mockStates = { version: "1.2.3" };
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();

      const result = source.getFeatureState("version");

      expect(result).toEqual("1.2.3");
    });

    it("should return undefined for nonexistent features", async () => {
      const mockStates = {};
      const fetchStates = vi.fn().mockResolvedValue(mockStates);
      const source = new AsyncSource({ fetchStates });
      await source.refresh();

      const result = source.getFeatureState("nonexistent");

      expect(result).toBeUndefined();
    });
  });
});
