import { FeatureStatus } from 'src/types'

export const API_BASE_URL = 'http://localhost:3000/api'

export const STORAGE_KEYS = {
  VOTED_FEATURES: '@wishflow/voted_features',
}

export const statusColors = {
  [FeatureStatus.PENDING]: '#FFA500',
  [FeatureStatus.IN_REVIEW]: '#008000',
  [FeatureStatus.PLANNED]: '#0000FF',
  [FeatureStatus.IN_PROGRESS]: '#FFA500',
  [FeatureStatus.COMPLETED]: '#008000',
  [FeatureStatus.REJECTED]: '#FF0000',
}

export const THEME = {
  PRIMARY_COLOR: '#007AFF',
  BACKGROUND_COLOR: '#FFFFFF',
  TEXT_COLOR: '#000000',
}
