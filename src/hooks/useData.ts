import { useState, useCallback, useEffect } from 'react'
import { Feature, FeatureFormData, UserInfo, Vote } from '../types'
import { fetchFeatures, createFeature, voteFeature, fetchVotes } from '../api'
import { WishFlow } from '../config'

export const useData = () => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loaded, setLoaded] = useState(false)
  const { userInfo, appId } = WishFlow.config

  const loadFeatures = useCallback(async () => {
    setFeatures(await fetchFeatures(userInfo?.locale || 'en'))
  }, [userInfo?.locale])

  const addFeature = useCallback(async (feature: FeatureFormData, userInfo: UserInfo) => {
    const newFeature = await createFeature({ feature, userInfo })
    setFeatures((prev) => [...prev, newFeature])
  }, [])

  const vote = useCallback(
    async (featureId: string) => {
      if (!userInfo?.userId) {
        throw new Error('User ID is not set')
      }

      await voteFeature(featureId)

      const newFeatures = features.map((feature) =>
        feature.id === featureId ? { ...feature, votesCount: feature.votesCount + 1 } : feature,
      )

      setFeatures(newFeatures)
    },
    [features, userInfo?.userId],
  )

  const loadVotes = useCallback(async () => {
    setVotes(await fetchVotes())
  }, [])

  const refresh = useCallback(async () => {
    await Promise.all([loadFeatures(), loadVotes()])
  }, [loadVotes, loadFeatures])

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadFeatures(), loadVotes()])
      setLoaded(true)
    }

    if (appId && !loaded) {
      init()
    }
  }, [loadFeatures, loadVotes, loaded, appId])

  return {
    loaded,
    features,
    votes,
    vote,
    addFeature,
    loadVotes,
    refresh,
  }
}
