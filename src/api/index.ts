import { Feature, Vote } from '../types'
import { API_BASE_URL } from '../constants'
import { WishFlow } from '../config'

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-app-secret-key': WishFlow.config.secretKey,
    'x-app-id': WishFlow.config.appId,
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

  const data = await response.json()

  return data
}

export const voteFeature = async (featureId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/features/${featureId}/vote`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        ...(WishFlow.config.userInfo?.userId && { 'x-user-id': WishFlow.config.userInfo?.userId }),
      },
    })

    if (response.status !== 200) {
      const data = await response.json()

      console.log(data.error)
    }
  } catch (error) {
    console.log(error)
  }
}

export const fetchVotes = async (): Promise<Vote[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/features/voted`, {
      method: 'GET',
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch votes')
    }

    const data = await response.json()

    return data.votes
  } catch (err) {
    console.error(err)
    return []
  }
}
