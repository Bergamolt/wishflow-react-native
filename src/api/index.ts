import { Feature, FeatureFormData, UserInfo, Vote } from '../types'

import { WishFlow } from '../config'

export const API_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://wishflow.dev/api'

export const ENDPOINTS = {
  FEATURES: `${API_URL}/features`,
  FEATURE_CREATE: `${API_URL}/features/create`,
  FEATURE_UPDATE: `${API_URL}/features/update`,
  FEATURE_DELETE: `${API_URL}/features/delete`,
  FEATURE_VOTE: `${API_URL}/features/vote`,
  FEATURE_VOTES: `${API_URL}/features/votes`,
}

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-app-secret-key': WishFlow.config.secretKey,
    'x-app-id': WishFlow.config.appId,
  }
}

const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to create feature'
}

export const fetchFeatures = async (locale: string): Promise<Feature[]> => {
  try {
    const response = await fetch(ENDPOINTS.FEATURES, {
      headers: getHeaders(),
    })

    const parsedResponse = await response.json()

    if (!response.ok) {
      throw new Error(parsedResponse.error || 'Failed to fetch features')
    }

    return parsedResponse.data.filter((feature: Feature) => feature.locale === locale)
  } catch (error) {
    console.log(handleApiError(error))

    return []
  }
}

export const createFeature = async ({
  feature,
  userInfo,
}: {
  feature: FeatureFormData
  userInfo: UserInfo
}): Promise<Feature> => {
  try {
    const response = await fetch(ENDPOINTS.FEATURE_CREATE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...feature, userInfo }),
    })

    const parsedResponse = await response.json()

    if (!response.ok) {
      throw new Error(parsedResponse.error || 'Failed to create feature')
    }

    return parsedResponse.data
  } catch (error) {
    console.log(handleApiError(error))

    return {} as Feature
  }
}

export const voteFeature = async (featureId: string): Promise<void> => {
  try {
    const response = await fetch(ENDPOINTS.FEATURE_VOTE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ featureId, userId: WishFlow.config.userInfo?.userId }),
    })

    const parsedResponse = await response.json()

    if (!response.ok) {
      throw new Error(parsedResponse.error || 'Failed to create feature')
    }
  } catch (error) {
    console.log(handleApiError(error))
  }
}

export const fetchVotes = async (): Promise<Vote[]> => {
  try {
    const response = await fetch(ENDPOINTS.FEATURE_VOTES, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId: WishFlow.config.userInfo?.userId }),
    })

    const parsedResponse = await response.json()

    if (!response.ok) {
      throw new Error(parsedResponse.error || 'Failed to fetch votes')
    }

    return parsedResponse.data
  } catch (error) {
    console.log(handleApiError(error))
    return []
  }
}
