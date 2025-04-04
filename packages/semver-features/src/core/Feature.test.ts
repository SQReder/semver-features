import { Range, SemVer } from "semver";
import { describe, expect, it, vi } from "vitest";
import type { FeatureStateSource } from "../sources/types";
import { asRange } from "../utils/asRange";
import { Feature } from "./Feature";

describe("Feature", () => {
  /**
   * Feature Initialization and Configuration
   */
  describe("initialization and configuration", () => {
    it("should enable feature when current version matches required version", () => {
      // Arrange
      const featureConfig = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [],
      };

      // Act
      const feature = new Feature(featureConfig);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should disable feature when current version is lower than required", () => {
      // Arrange
      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("2.0.0"),
        sources: [],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(false);
    });

    it("should enable feature when current version is higher than required", () => {
      // Arrange
      const config = {
        name: "test-feature",
        currentVersion: new SemVer("2.1.0"),
        versionsRange: asRange("2.0.0"),
        sources: [],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should enable feature when versionsRange is true", () => {
      // Arrange
      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should disable feature when versionsRange is false", () => {
      // Arrange
      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(false);
    });

    it("should initialize with empty sources array", () => {
      // Arrange
      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should initialize with undefined sources array", () => {
      // Arrange
      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: undefined,
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should correctly store required version", () => {
      // Arrange
      const featureConfig = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [],
      };

      // Act
      const feature = new Feature(featureConfig);

      // Assert
      expect((feature.requiredVersion as Range).format()).toBe(">=1.0.0");
    });
  });

  /**
   * Version Validation
   */
  describe("version validation", () => {
    it("should throw error with invalid current version format", () => {
      // Arrange
      const invalidConfig = {
        name: "test",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: "invalid-version" as any,
        sources: [],
      };

      // Act & Assert
      expect(() => new Feature(invalidConfig)).toThrow();
    });

    it("should not throw error with valid version format", () => {
      // Arrange
      const validConfig = {
        name: "test",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [],
      };

      // Act & Assert
      expect(() => new Feature(validConfig)).not.toThrow();
    });
  });

  /**
   * Feature State Source Handling
   */
  describe("feature state source handling", () => {
    it("should prioritize source state over version comparison when source enables feature", () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: (name: string) =>
          name === "test-feature" ? true : undefined,
      };

      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("2.0.0"),
        sources: [mockSource],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should prioritize source state over version comparison when source disables feature", () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: (name: string) =>
          name === "test-feature" ? false : undefined,
      };

      const config = {
        name: "test-feature",
        currentVersion: new SemVer("2.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [mockSource],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(false);
    });

    it("should check sources in order and use first defined state", () => {
      // Arrange
      const firstSource: FeatureStateSource = {
        getFeatureState: () => undefined,
      };

      const secondSource: FeatureStateSource = {
        getFeatureState: (name: string) =>
          name === "test-feature" ? true : undefined,
      };

      const config = {
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("2.0.0"),
        sources: [firstSource, secondSource],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should fall back to version comparison when no source provides a state", () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: () => undefined,
      };

      const config = {
        name: "test-feature",
        currentVersion: new SemVer("2.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [mockSource],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should enable feature when source returns a version string lower than current version", () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: (name: string) =>
          name === "test-feature" ? "1.5.0" : undefined,
      };

      const config = {
        name: "test-feature",
        currentVersion: new SemVer("2.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [mockSource],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(true);
    });

    it("should disable feature when source returns a version string higher than current version", () => {
      // Arrange
      const mockSource: FeatureStateSource = {
        getFeatureState: (name: string) =>
          name === "test-feature" ? "3.0.0" : undefined,
      };

      const config = {
        name: "test-feature",
        currentVersion: new SemVer("2.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [mockSource],
      };

      // Act
      const feature = new Feature(config);

      // Assert
      expect(feature.isEnabled).toBe(false);
    });
  });

  /**
   * FeatureValue Selection (select method)
   */
  describe("FeatureValue selection", () => {
    it("should return enabled value when feature is enabled", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature.select({
        enabled: "ON",
        disabled: "OFF",
      });

      // Assert
      expect(result.value).toBe("ON");
    });

    it("should return disabled value when feature is disabled", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature.select({
        enabled: "ON",
        disabled: "OFF",
      });

      // Assert
      expect(result.value).toBe("OFF");
    });

    it("should handle complex object values for enabled features", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      const enabledObject = {
        key: "enabled",
        value: 42,
        nested: { flag: true },
      };
      const disabledObject = {
        key: "disabled",
        value: 0,
        nested: { flag: false },
      };

      // Act
      const result = feature.select({
        enabled: enabledObject,
        disabled: disabledObject,
      });

      // Assert
      expect(result.value).toEqual(enabledObject);
    });

    it("should handle complex object values for disabled features", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      const enabledObject = {
        key: "enabled",
        value: 42,
        nested: { flag: true },
      };
      const disabledObject = {
        key: "disabled",
        value: 0,
        nested: { flag: false },
      };

      // Act
      const result = feature.select({
        enabled: enabledObject,
        disabled: disabledObject,
      });

      // Assert
      expect(result.value).toEqual(disabledObject);
    });

    it("should support optional disabled field for disabled features", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });
      
      const result = feature.select({
        enabled: "ON",
      });
      
      expect(result.isEnabled).toBe(false);
      expect(result.value).toBeUndefined();
    });

    it("should handle nullable values correctly with optional disabled field", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });
      
      const result = feature.select({
        enabled: { id: 123, name: "test" },
        disabled: null,
      });
      
      expect(result.isEnabled).toBe(false);
      expect(result.value).toBeNull();
    });
  });

  /**
   * FeatureValue Transformation (map method)
   */
  describe("FeatureValue transformation", () => {
    it("should apply map function to enabled value with simple types", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature.select({ enabled: 1, disabled: 0 }).map({
        enabled: (n) => n + 1,
        disabled: (n) => n - 1,
      });

      // Assert
      expect(result.value).toBe(2);
    });

    it("should apply map function to disabled value with simple types", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature.select({ enabled: 1, disabled: 0 }).map({
        enabled: (n) => n + 1,
        disabled: (n) => n - 1,
      });

      // Assert
      expect(result.value).toBe(-1);
    });

    it("should map enabled value with different input/output types", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature.select({ enabled: 42, disabled: "inactive" }).map({
        enabled: (n) => n.toString(),
        disabled: (s) => s.toUpperCase(),
      });

      // Assert
      expect(result.value).toBe("42");
    });

    it("should map disabled value with different input/output types", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature.select({ enabled: 42, disabled: "inactive" }).map({
        enabled: (n) => n.toString(),
        disabled: (s) => s.toUpperCase(),
      });

      // Assert
      expect(result.value).toBe("INACTIVE");
    });

    it("should map complex object properties", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature
        .select({
          enabled: { count: 5, label: "test" },
          disabled: { count: 0, label: "disabled" },
        })
        .map({
          enabled: (obj) => ({
            ...obj,
            count: obj.count * 2,
            label: obj.label.toUpperCase(),
          }),
          disabled: (obj) => ({ ...obj, count: -1, label: "INACTIVE" }),
        });

      // Assert
      expect(result.value).toEqual({ count: 10, label: "TEST" });
    });

    it("should use identity function when disabled transform isn't provided for enabled feature", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });
      
      const result = feature.select({ enabled: 42, disabled: 0 }).map({
        enabled: (n) => n + 1,
      });
      
      expect(result.value).toBe(43);
    });

    it("should use identity function when disabled transform isn't provided for disabled feature", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });
      
      const result = feature.select({ enabled: 42, disabled: "original" }).map({
        enabled: (n) => n.toString(),
      });
      
      expect(result.value).toBe("original");
    });

    it("should use identity function when enabled transform isn't provided for enabled feature", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });
      
      const result = feature.select({ enabled: "original", disabled: 0 }).map({
        disabled: (n) => n + 1,
      });
      
      expect(result.value).toBe("original");
    });

    it("should use identity function when enabled transform isn't provided for disabled feature", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });
      
      const result = feature.select({ enabled: "test", disabled: 42 }).map({
        disabled: (n) => n * 2,
      });
      
      expect(result.value).toBe(84);
    });

    it("should handle complex objects with identity transform for disabled value", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      const complexObject = { prop: "value", nested: { num: 123 } };
      
      const result = feature.select({ 
        enabled: "enabled", 
        disabled: complexObject 
      }).map({
        enabled: (s) => s.toUpperCase(),
      });
      
      expect(result.value).toBe(complexObject);
    });

    it("should handle complex objects with identity transform for enabled value", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      const complexObject = { prop: "value", nested: { num: 123 } };
      
      const result = feature.select({ 
        enabled: complexObject,
        disabled: "disabled"
      }).map({
        disabled: (s) => s.toUpperCase(),
      });
      
      expect(result.value).toBe(complexObject);
    });
  });

  /**
   * FeatureValue Reduction (fold method)
   */
  describe("FeatureValue reduction", () => {
    it("should apply fold function to enabled value with simple types", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature.select({ enabled: "Yes", disabled: "No" }).fold({
        enabled: (s) => s.toUpperCase(),
        disabled: (s) => s.toLowerCase(),
      });

      // Assert
      expect(result).toBe("YES");
    });

    it("should apply fold function to disabled value with simple types", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature.select({ enabled: "Yes", disabled: "No" }).fold({
        enabled: (s) => s.toUpperCase(),
        disabled: (s) => s.toLowerCase(),
      });

      // Assert
      expect(result).toBe("no");
    });

    it("should fold complex objects to derived values for enabled feature", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature
        .select({
          enabled: { items: ["a", "b", "c"], active: true },
          disabled: { items: ["x", "y"], active: false },
        })
        .fold<number>({
          enabled: (obj) => obj.items.length,
          disabled: (obj) => obj.items.length * -1,
        });

      // Assert
      expect(result).toBe(3);
    });

    it("should fold complex objects to derived values for disabled feature", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature
        .select({
          enabled: { items: ["a", "b", "c"], active: true },
          disabled: { items: ["x", "y"], active: false },
        })
        .fold<string | number>({
          enabled: (obj) => obj.items.length,
          disabled: (obj) => obj.items.join("-"),
        });

      // Assert
      expect(result).toBe("x-y");
    });
  });

  /**
   * Conditional Execution
   */
  describe("conditional execution", () => {
    it("should execute enabled function when feature is enabled", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature.execute({
        enabled: () => "enabled",
        disabled: () => "disabled",
      });

      // Assert
      expect(result).toBe("enabled");
    });

    it("should execute disabled function when feature is disabled", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature.execute({
        enabled: () => "enabled",
        disabled: () => "disabled",
      });

      // Assert
      expect(result).toBe("disabled");
    });

    it("should execute callback when feature is enabled", () => {
      // Arrange
      const feature = new Feature({
        name: "enabled-feature",
        currentVersion: new SemVer("2.0.0"),
        versionsRange: asRange("1.0.0"),
        sources: [],
      });
      const callback = vi.fn().mockReturnValue("callback result");

      // Act
      feature.when(callback);

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not execute callback when feature is disabled", () => {
      // Arrange
      const feature = new Feature({
        name: "disabled-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange("2.0.0"),
        sources: [],
      });
      const callback = vi.fn().mockReturnValue("callback result");

      // Act
      feature.when(callback);

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });

    it("should return the callback result when feature is enabled", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
        sources: [],
      });

      // Act
      const result = feature.when(() => "test value");

      // Assert
      expect(result).toBe("test value");
    });

    it("should return undefined when feature is disabled", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
        sources: [],
      });

      // Act
      const result = feature.when(() => "test value");

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
