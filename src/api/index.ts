import { Feature } from '../types'
import { API_BASE_URL } from '../constants'
import { WishFlow } from '../config'

const getHeaders = () => {
  const { secretKey, appId } = WishFlow.config

  return {
    'Content-Type': 'application/json',
    'x-app-secret-key': secretKey,
    'x-app-id': appId,
  }
}

export const fetchFeatures = async (locale: string): Promise<Feature[]> => {
  const response = await fetch(`${API_BASE_URL}/features`, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch features')
  }

  const data = await response.json()

  // filter by locale
  return data.filter((feature: Feature) => feature.locale === locale)
}

export const createFeature = async (
  feature: Omit<Feature, 'id' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>,
): Promise<Feature> => {
  console.log('createFeature', feature)
  const response = await fetch(`${API_BASE_URL}/features/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      ...feature,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create feature')
  }

  return response.json()
}

export const voteFeature = async (featureId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/features/${featureId}/vote`, {
    method: 'POST',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to vote for feature')
  }
}
