import { describe, expect, it } from "vitest";
import {
  JsonSemverFeatures,
  createSemverFeaturesJson,
  getSchema,
} from "../src/index";

describe("JsonSemverFeatures", () => {
  // Valid configuration for testing
  const validConfig = {
    features: [
      {
        name: "feature1",
        description: "Feature 1",
        versionRange: ">=1.0.0",
        enabledByDefault: true,
        deprecated: false,
      },
      {
        name: "feature2",
        description: "Feature 2",
        versionRange: ">=2.0.0",
        enabledByDefault: false,
        deprecated: false,
      },
      {
        name: "booleanFeature",
        description: "Boolean Feature",
        versionRange: "",
        enabledByDefault: true,
        deprecated: false,
      },
    ],
  } as const;

  // Options for SemverFeatures
  const options = {
    version: "1.5.0",
  };

  it("should correctly initialize with valid configuration", () => {
    // Arrange & Act
    const instance = new JsonSemverFeatures(validConfig, options);

    // Assert
    expect(instance).toBeInstanceOf(JsonSemverFeatures);
  });

  it("should register features from configuration", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    const features = instance.getAllFeatures();

    // Assert
    expect(features.size).toBe(3);
  });

  it("should get feature by name using typed getter", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    const feature = instance.get("feature1");

    // Assert
    expect(feature).toBeDefined();
  });

  it("should return undefined for non-existent feature", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    // @ts-expect-error - nonExistent is not a valid feature name
    const feature = instance.get("nonExistent");

    // Assert
    expect(feature).toBeUndefined();
  });

  it("should check if feature is enabled correctly for enabled feature", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    const isEnabled = instance.isEnabled("feature1");

    // Assert
    expect(isEnabled).toBe(true);
  });

  it("should check if feature is enabled correctly for disabled feature", () => {
    // Arrange
    // Use a version that disables feature2 based on its version range (>=2.0.0)
    const instanceWithEarlierVersion = new JsonSemverFeatures(validConfig, {
      version: "1.0.0",
    });

    // Act
    const isEnabled = instanceWithEarlierVersion.isEnabled("feature2");

    // Assert
    expect(isEnabled).toBe(false);
  });

  it("should check if non-existent feature is disabled", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    // @ts-expect-error - nonExistent is not a valid feature name
    const isEnabled = instance.isEnabled("nonExistent");

    // Assert
    expect(isEnabled).toBe(false);
  });

  it("should handle features with version ranges", () => {
    // Arrange
    const instanceWithLaterVersion = new JsonSemverFeatures(validConfig, {
      version: "2.5.0",
    });

    // Act
    const isEnabled = instanceWithLaterVersion.isEnabled("feature2");

    // Assert
    expect(isEnabled).toBe(true);
  });

  it("should handle features with boolean enablement", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    const isEnabled = instance.isEnabled("booleanFeature");

    // Assert
    expect(isEnabled).toBe(true);
  });

  it("should get all registered features", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    const features = instance.getAllFeatures();

    // Assert
    expect(features instanceof Map).toBe(true);
  });

  it("should include all feature names in the features map", () => {
    // Arrange
    const instance = new JsonSemverFeatures(validConfig, options);

    // Act
    const features = instance.getAllFeatures();

    // Assert
    expect(features.has("feature1")).toBe(true);
  });
});

describe("getSchema function", () => {
  it("should return the schema object", () => {
    // Arrange & Act
    const schema = getSchema();

    // Assert
    expect(schema).toBeDefined();
  });
});

describe("createSemverFeaturesJson factory function", () => {
  // Valid configuration for testing
  const validConfig = {
    features: [
      {
        name: "feature1",
        description: "Feature 1",
        versionRange: ">=1.0.0",
        deprecated: false,
      },
    ],
  };

  // Options for SemverFeatures
  const options = {
    version: "1.5.0",
  };

  it("should create a JsonSemverFeatures instance with valid configuration", () => {
    // Arrange & Act
    const instance = createSemverFeaturesJson(validConfig, options);

    // Assert
    expect(instance).toBeInstanceOf(JsonSemverFeatures);
  });

  it("should throw error when invalid configuration is provided", () => {
    // Arrange
    const invalidConfig = {
      features: [
        {
          // Missing required properties
          name: "incomplete",
        },
      ],
    };

    // Act & Assert
    expect(() =>
      createSemverFeaturesJson(invalidConfig as any, options)
    ).toThrow();
  });
});
