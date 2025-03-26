import { satisfies, validRange } from 'semver';

export type FeatureFlagMap = Record<string, string>;

export function createFeatureFlagSystem<
  Flags extends FeatureFlagMap
>(
  featureFlags: Flags,
  currentVersion: string
) {
  type FeatureName = keyof Flags;

  // Проверка на корректность semver-диапазонов
  const validatedFlags = Object.entries(featureFlags).filter(
    ([_, range]) => validRange(range)
  );

  function isFeatureEnabled(name: FeatureName): boolean {
    const range = featureFlags[name];
    if (!range || !validRange(range)) return false;
    return satisfies(currentVersion, range);
  }

  function getEnabledFeatures(): FeatureName[] {
    return (Object.keys(featureFlags) as FeatureName[]).filter(isFeatureEnabled);
  }

  function getExpiredFeatures(): { name: FeatureName; range: string; currentVersion: string }[] {
    return (Object.entries(featureFlags) as [FeatureName, string][]).filter(
      ([_, range]) => !satisfies(currentVersion, range)
    ).map(([name, range]) => ({ name, range, currentVersion }));
  }

  return {
    isFeatureEnabled,
    getEnabledFeatures,
    getExpiredFeatures,
  };
}
