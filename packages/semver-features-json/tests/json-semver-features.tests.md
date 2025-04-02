# JsonSemverFeatures Test Plan

## Overview
This test plan covers the JsonSemverFeatures class functionality, which extends SemverFeatures with strongly typed feature access.

## Plan
Testing will focus on initialization, feature registration, retrieval, enablement states, and feature listing functionality.

## Test Cases

### Initialization
- Should correctly initialize with valid configuration

### Feature Registration
- Should register all features from configuration
- Should include specific feature names in the features map

### Feature Retrieval
- Should get feature by name using typed getter
- Should throw error for non-existent feature

### Feature Enablement
- Should enable feature when version matches range
- Should disable feature when version doesn't match range
- Should enable feature when version meets minimum range
- Should properly handle boolean enablement features
- Should throw error for non-existent features when checking enablement

### Feature Listing
- Should return a Map when getting all features 