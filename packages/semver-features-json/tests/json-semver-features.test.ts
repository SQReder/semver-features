import { describe, expect, it } from "vitest";
import { JsonSemverFeatures } from "../src/json-semver-features";

describe("JsonSemverFeatures", () => {
  const createValidConfig = () => ({
    features: [
      {
        name: "feature1",
        description: "Feature 1",
        versionRange: ">=1.0.0",
        deprecated: false,
      },
      {
        name: "feature2",
        description: "Feature 2",
        versionRange: ">=2.0.0",
        deprecated: false,
      },
      {
        name: "booleanFeature",
        description: "Boolean Feature",
        versionRange: "",
        deprecated: false,
      },
    ],
  } as const);

  describe("initialization", () => {
    it("should correctly initialize with valid configuration", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      
      const instance = new JsonSemverFeatures(validConfig, options);
      
      expect(instance).toBeInstanceOf(JsonSemverFeatures);
    });
  });

  describe("feature registration", () => {
    it("should register all features from configuration", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const features = instance.getAllFeatures();
      
      expect(features.size).toBe(3);
    });

    it("should include specific feature names in the features map", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const features = instance.getAllFeatures();
      
      expect(features.has("feature1")).toBe(true);
    });
  });

  describe("feature retrieval", () => {
    it("should get feature by name using typed getter", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const feature = instance.get("feature1");
      
      expect(feature).toBeDefined();
    });

    it("should throw error for non-existent feature", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      // Using type assertion for the test
      const getInvalidFeature = () => instance.get("nonExistent" as any);
      
      expect(getInvalidFeature).toThrow();
    });
  });

  describe("feature enablement", () => {
    it("should enable feature when version matches range", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const isEnabled = instance.isEnabled("feature1");
      
      expect(isEnabled).toBe(true);
    });

    it("should disable feature when version doesn't match range", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.0.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const isEnabled = instance.isEnabled("feature2");
      
      expect(isEnabled).toBe(false);
    });

    it("should enable feature when version meets minimum range", () => {
      const validConfig = createValidConfig();
      const options = { version: "2.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const isEnabled = instance.isEnabled("feature2");
      
      expect(isEnabled).toBe(true);
    });

    it("should properly handle boolean enablement features", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const isEnabled = instance.isEnabled("booleanFeature");
      
      expect(isEnabled).toBe(true);
    });

    it("should throw error for non-existent features when checking enablement", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      // Using type assertion for the test
      const checkInvalidFeature = () => instance.isEnabled("nonExistent" as any);
      
      expect(checkInvalidFeature).toThrow();
    });
  });

  describe("feature listing", () => {
    it("should return a Map when getting all features", () => {
      const validConfig = createValidConfig();
      const options = { version: "1.5.0" };
      const instance = new JsonSemverFeatures(validConfig, options);
      
      const features = instance.getAllFeatures();
      
      expect(features instanceof Map).toBe(true);
    });
  });
}); 