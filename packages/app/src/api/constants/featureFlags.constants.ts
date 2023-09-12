import {AIProvidersFlagEnum, FeatureFlagEnum} from 'api/enums';

import {appVariables} from './app.variables';

export const isFeatureEnabled = (feature: FeatureFlagEnum): boolean => {
  return appVariables.FEATURE_FLAGS[feature];
};

export const isAIProviderEnabled = (provider: AIProvidersFlagEnum): boolean => {
  return appVariables.AI_PROVIDERS[provider];
};
