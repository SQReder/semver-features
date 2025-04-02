# Factory Functions Test Plan

## Overview
This test plan covers the factory and schema-related utility functions, including `createSemverFeaturesJson` and `getSchema`.

## Plan
Testing will focus on ensuring the factory function correctly creates JsonSemverFeatures instances, validates configurations, and that the schema is properly exposed.

## Test Cases

### getSchema Function
- Should return a defined schema object

### createSemverFeaturesJson Factory Function

#### Successful Creation
- Should create an instance with valid configuration

#### Validation Errors
- Should throw error when invalid configuration is provided 