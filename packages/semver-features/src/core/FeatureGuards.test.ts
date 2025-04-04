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
      const enabledValue = new EnabledFeatureValue<string, number>("test");
      
      const result = isEnabled(enabledValue);
      
      expect(result).toBe(true);
    });

    it("should correctly reject DisabledFeatureValue instances with isEnabled", () => {
      const disabledValue = new DisabledFeatureValue<string, number>(42);
      
      const result = isEnabled(disabledValue);
      
      expect(result).toBe(false);
    });

    it("should correctly identify DisabledFeatureValue instances with isDisabled", () => {
      const disabledValue = new DisabledFeatureValue<string, number>(42);
      
      const result = isDisabled(disabledValue);
      
      expect(result).toBe(true);
    });

    it("should correctly reject EnabledFeatureValue instances with isDisabled", () => {
      const enabledValue = new EnabledFeatureValue<string, number>("test");
      
      const result = isDisabled(enabledValue);
      
      expect(result).toBe(false);
    });
  });

  /**
   * Type Guard Integration
   */
  describe("type guard integration", () => {
    it("should work with values from Feature.select()", () => {
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
      
      const enabledValue = enabledFeature.select({ 
        enabled: "ON", 
        disabled: "OFF" 
      });
      
      const disabledValue = disabledFeature.select({ 
        enabled: "ON", 
        disabled: "OFF" 
      });
      
      expect(isEnabled(enabledValue)).toBe(true);
      expect(isDisabled(enabledValue)).toBe(false);
      expect(isEnabled(disabledValue)).toBe(false);
      expect(isDisabled(disabledValue)).toBe(true);
    });
    
    it("should work with transformed values after using map()", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: true,
      });
      
      const initialValue = feature.select({ 
        enabled: 42, 
        disabled: "disabled" 
      });
      
      const transformedValue = initialValue.map({
        enabled: num => num.toString(),
        disabled: str => str.length
      });
      
      expect(isEnabled(transformedValue)).toBe(true);
      if (isEnabled(transformedValue)) {
        expect(transformedValue.value).toBe("42");
      }
    });
    
    it("should allow conditional handling based on feature state", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: asRange(">=2.0.0"),
      });
      
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
      
      expect(result).toBe("disabled");
    });
  });

  /**
   * Type Guard Integration with Optional Fields
   */
  describe("type guard integration with optional fields", () => {
    it("should work with values from Feature.select() with optional disabled field", () => {
      const disabledFeature = new Feature({
        name: "disabled-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
      });
      
      const disabledValue = disabledFeature.select({ 
        enabled: "ON"
      });
      
      expect(isEnabled(disabledValue)).toBe(false);
      expect(isDisabled(disabledValue)).toBe(true);
    });
    
    it("should work with transformed values after using map() with optional disabled transform", () => {
      const feature = new Feature({
        name: "test-feature",
        currentVersion: new SemVer("1.0.0"),
        versionsRange: false,
      });
      
      const initialValue = feature.select({ 
        enabled: 42, 
        disabled: "disabled" 
      });
      
      const transformedValue = initialValue.map({
        enabled: num => num.toString(),
      });
      
      expect(isDisabled(transformedValue)).toBe(true);
      if (isDisabled(transformedValue)) {
        expect(transformedValue.value).toBe("disabled");
      }
    });
  });

  /**
   * Runtime Behavior
   */
  describe("runtime behavior", () => {
    it("should work with direct class instantiation", () => {
      const enabled = new EnabledFeatureValue<string, number>("direct");
      const disabled = new DisabledFeatureValue<string, number>(123);
      
      expect(isEnabled(enabled)).toBe(true);
      expect(isDisabled(disabled)).toBe(true);
    });
  });
}); 