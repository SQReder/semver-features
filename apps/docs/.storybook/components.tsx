import React from 'react';
import { SemverFeatures } from 'semver-features';

// Define our enhanced features type with a version we can access
interface EnhancedFeatures {
  register: (name: string, requiredVersion: string) => { isEnabled: boolean };
  version: string;
}

// Create a context for our enhanced features
const FeaturesContext = React.createContext<EnhancedFeatures | null>(null);

export const SemverFeaturesProvider: React.FC<{
  features: SemverFeatures;
  children: React.ReactNode;
}> = ({ features, children }) => {
  // Create an enhanced features object that exposes the version
  const enhancedFeatures: EnhancedFeatures = {
    register: (name, requiredVersion) => features.register(name, requiredVersion),
    version: (features as any)._options?.version || '1.0.0'
  };
  
  return (
    <FeaturesContext.Provider value={enhancedFeatures}>
      {children}
    </FeaturesContext.Provider>
  );
};

export const useSemverFeatures = () => {
  const context = React.useContext(FeaturesContext);
  if (!context) {
    throw new Error('useSemverFeatures must be used within a SemverFeaturesProvider');
  }
  return context;
};

// Create a Feature component that matches the API in our stories
export const Feature: React.FC<{
  name: string;
  requiredVersion: string;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  render?: (props: { isEnabled: boolean }) => React.ReactNode;
}> = ({ name, requiredVersion, children, fallback, render }) => {
  const features = useSemverFeatures();
  const feature = features.register(name, requiredVersion);
  
  if (render) {
    return <>{render({ isEnabled: feature.isEnabled })}</>;
  }
  
  return feature.isEnabled ? <>{children}</> : <>{fallback}</>;
}; 