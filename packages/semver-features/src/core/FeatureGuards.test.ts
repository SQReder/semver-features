import { SemVer } from "semver";
import { describe, expect, it } from "vitest";
import { Feature, EnabledFeatureValue, DisabledFeatureValue } from "./Feature";
import { isEnabled, isDisabled } from "./FeatureGuards";
import { asRange } from "../utils/asRange";

describe("FeatureGuards", () => {
  /**
   * Type Guard Detection
   */
  describe("type guard detection", () => {
    it("should correctly identify EnabledFeatureValue instances with isEnabled", () => {
      // Arrange
      const enabledValue = new EnabledFeatureValue<string, number>("test");
      
      // Act
      const result = isEnabled(enabledValue);
      
      // Assert
      expect(result).toBe(true);
    });

    it("should correctly reject DisabledFeatureValue instances with isEnabled", () => {
      // Arrange
      const disabledValue = new DisabledFeatureValue<string, number>(42);
      
      // Act
      const result = isEnabled(disabledValue);
      
      // Assert
      expect(result).toBe(false);
    });

    it("should correctly identify DisabledFeatureValue instances with isDisabled", () => {
      // Arrange
      const disabledValue = new DisabledFeatureValue<string, number>(42);
      
      // Act
      const result = isDisabled(disabledValue);
      
      // Assert
      expect(result).toBe(true);
    });

    it("should correctly reject EnabledFeatureValue instances with isDisabled", () => {
      // Arrange
      const enabledValue = new EnabledFeatureValue<string, number>("test");
      
      // Act
      const result = isDisabled(enabledValue);
      
      // Assert
      expect(result).toBe(false);
    });
  });

  /**
   * Type Guard Integration
   */
  describe("type guard integration", () => {
    it("should work with values from Feature.select()", () => {
      // Arrange
      const enabledFeature = new Feature({
        name: "enabled-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
      });
      
      const disabledFeature = new Feature({
        name: "disabled-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
      });
      
      // Act
      const enabledValue = enabledFeature.select({ 
        enabled: "ON", 
        disabled: "OFF" 
      });
      
      const disabledValue = disabledFeature.select({ 
        enabled: "ON", 
        disabled: "OFF" 
      });
      
      // Assert
      expect(isEnabled(enabledValue)).toBe(true);
      expect(isDisabled(enabledValue)).toBe(false);
      expect(isEnabled(disabledValue)).toBe(false);
      expect(isDisabled(disabledValue)).toBe(true);
    });
    
    it("should work with transformed values after using map()", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
      });
      
      // Act
      const initialValue = feature.select({ 
        enabled: 42, 
        disabled: "disabled" 
      });
      
      const transformedValue = initialValue.map({
        enabled: num => num.toString(),
        disabled: str => str.length
      });
      
      // Assert
      expect(isEnabled(transformedValue)).toBe(true);
      if (isEnabled(transformedValue)) {
        expect(transformedValue.value).toBe("42");
      }
    });
    
    it("should allow conditional handling based on feature state", () => {
      // Arrange
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange(">=2.0.0"),
      });
      
      // Act
      const featureValue = feature.select({ 
        enabled: { data: "enabled" }, 
        disabled: { error: "disabled" } 
      });
      
      let result;
      if (isEnabled(featureValue)) {
        result = featureValue.value.data;
      } else {
        result = featureValue.value.error;
      }
      
      // Assert
      expect(result).toBe("disabled");
    });
  });

  /**
   * Runtime Behavior
   */
  describe("runtime behavior", () => {
    it("should work with direct class instantiation", () => {
      // Arrange
      const enabled = new EnabledFeatureValue<string, number>("direct");
      const disabled = new DisabledFeatureValue<string, number>(123);
      
      // Act & Assert
      expect(isEnabled(enabled)).toBe(true);
      expect(isDisabled(disabled)).toBe(true);
    });
  });
}); 