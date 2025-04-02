import { describe, expect, it } from "vitest";
import { createSemverFeaturesJson } from "../src/factory";
import { JsonSemverFeatures } from "../src/json-semver-features";

describe("createSemverFeaturesJson factory function", () => {
  describe("successful creation", () => {
    it("should create an instance with valid configuration", () => {
      const validConfig = {
        features: [
          {
            name: "feature1",
            description: "Feature 1",
            versionRange: ">=1.0.0",
            deprecated: false,
          },
        ],
      } as const;
      const options = { version: "1.5.0" };
      
      const instance = createSemverFeaturesJson(validConfig, options);
      
      expect(instance).toBeInstanceOf(JsonSemverFeatures);
    });
  });

  describe("validation errors", () => {
    it("should throw error when invalid configuration is provided", () => {
      const invalidConfig = {
        features: [
          {
            // Missing required properties
            name: "incomplete",
          },
        ],
      };
      const options = { version: "1.5.0" };
      
      const createWithInvalidConfig = () => 
        createSemverFeaturesJson(invalidConfig as any, options);
      
      expect(createWithInvalidConfig).toThrow();
    });
  });
}); 