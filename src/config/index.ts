import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { FeatureStatus, WishFlowConfig, SetWishFlowConfig, Theme } from '../types'
import { createWishFlowContainerStyles } from '../components/Content'
import { createAddFeatureModalStyles } from '../components/AddFeatureModal'
import { createFeatureItemStyles } from '../components/FeatureItem'
import { createFeatureListStyles } from '../components/FeatureList'
import { createVoteButtonStyles } from '../components/VoteButton'
import { deepMerge } from '../utils/deepMerge'

export const createDefaultStyles = (theme: Theme) => {
  return {
    WishFlowContainer: createWishFlowContainerStyles(theme),
    AddFeatureModal: createAddFeatureModalStyles(theme),
    FeatureItem: createFeatureItemStyles(theme),
    FeatureList: createFeatureListStyles(theme),
    VoteButton: createVoteButtonStyles(theme),
  }
}

export type DefaultStyles = {
  [key in keyof ReturnType<typeof createDefaultStyles>]?: {
    [K in keyof ReturnType<typeof createDefaultStyles>[key]]?: ViewStyle | TextStyle | ImageStyle
  }
}

export const DEFAULT_LOCALE = 'en'

const defaultStatusColors = {
  [FeatureStatus.PENDING]: '#FFA500',
  [FeatureStatus.IN_REVIEW]: '#008000',
  [FeatureStatus.PLANNED]: '#0000FF',
  [FeatureStatus.IN_PROGRESS]: '#FFA500',
  [FeatureStatus.COMPLETED]: '#008000',
  [FeatureStatus.REJECTED]: '#FF0000',
}

const defaultTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#007AFF',
  secondary: '#FF3B30',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  card: '#F7F7F7',
  border: '#E0E0E0',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
}

export const initialConfig: WishFlowConfig = {
  secretKey: '',
  appId: '',
  userInfo: {
    userId: undefined,
    email: undefined,
    locale: DEFAULT_LOCALE,
  },
  styles: createDefaultStyles(defaultTheme),
  statusColors: defaultStatusColors,
  theme: defaultTheme,
}

class WishFlowSingleton {
  private static _instance: WishFlowSingleton
  private _config: WishFlowConfig = initialConfig

  private constructor() {}

  public static getInstance(): WishFlowSingleton {
    if (!WishFlowSingleton._instance) {
      WishFlowSingleton._instance = new WishFlowSingleton()
    }

    return WishFlowSingleton._instance
  }

  public setConfig(config: SetWishFlowConfig) {
    const theme = deepMerge(defaultTheme, config.theme)

    this._config = {
      ...this._config,
      ...config,
      theme,
      styles: deepMerge(createDefaultStyles(theme), config.styles),
    } as WishFlowConfig
  }

  public getConfig() {
    return this._config
  }

  public get config() {
    return this._config
  }
}

export const WishFlow = WishFlowSingleton.getInstance()

export const config = WishFlow.getConfig()
