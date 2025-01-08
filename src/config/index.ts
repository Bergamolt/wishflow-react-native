import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { WishFlowConfig } from '../types'
import { defaultStyles as defaultStylesContainer } from '../components/WishFlowContainer'
import { defaultStyles as defaultStylesAddFeatureModal } from '../components/AddFeatureModal'
import { defaultStyles as defaultStylesFeatureItem } from '../components/FeatureItem'
import { defaultStyles as defaultStylesFeatureTab } from '../components/FeatureTab'
import { defaultStyles as defaultStylesVoteButton } from '../components/VoteButton'
import { deepMerge } from '../utils/deepMerge'

const defaultStyles = {
  WishFlowContainer: defaultStylesContainer,
  AddFeatureModal: defaultStylesAddFeatureModal,
  FeatureItem: defaultStylesFeatureItem,
  FeatureTab: defaultStylesFeatureTab,
  VoteButton: defaultStylesVoteButton,
}

export type DefaultStyles = {
  [key in keyof typeof defaultStyles]?: {
    [K in keyof (typeof defaultStyles)[key]]?: ViewStyle | TextStyle | ImageStyle
  }
}

class WishFlowSingleton {
  private static _instance: WishFlowSingleton
  private _config: WishFlowConfig = {
    secretKey: '',
    appId: '',
    locale: DEFAULT_LOCALE,
    userId: undefined,
    styles: defaultStyles as DefaultStyles,
  }

  private constructor() {}

  public static getInstance(): WishFlowSingleton {
    if (!WishFlowSingleton._instance) {
      WishFlowSingleton._instance = new WishFlowSingleton()
    }

    return WishFlowSingleton._instance
  }

  public setConfig(config: WishFlowConfig): void {
    this._config = {
      ...config,
      styles: deepMerge(defaultStyles, config.styles), 
    }
  }

  get config() {
    if (!this._config.secretKey || !this._config.appId) {
      throw new Error('WishFlow is not initialized')
    }

    return this._config
  }
}

export const WishFlow = WishFlowSingleton.getInstance()

export const DEFAULT_LOCALE = 'en'
