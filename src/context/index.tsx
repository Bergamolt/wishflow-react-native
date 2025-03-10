import React, { createContext, useContext } from 'react'
import { WishFlowConfig } from '../types'
import { WishFlow } from '../config'
import { Content } from '../components/Content'
import { useData } from '../hooks/useData'

type WishFlowContextType = ReturnType<typeof useData>

// @ts-ignore
export const WishFlowContext = createContext<WishFlowContextType>({})

type WishFlowProviderProps = {
  config: WishFlowConfig
}

export const WishFlowProvider: React.FC<WishFlowProviderProps> = ({ config }) => {
  if (!config.secretKey || !config.appId) {
    throw new Error('WishFlow is not initialized')
  } else {
    WishFlow.setConfig(config)
  }

  const value = useData()

  return (
    <WishFlowContext.Provider value={value}>
      <Content />
    </WishFlowContext.Provider>
  )
}

export const useWishFlow = () => {
  const context = useContext(WishFlowContext)

  if (!context) {
    throw new Error('useWishFlow must be used within a WishFlowProvider')
  }

  return context
}
