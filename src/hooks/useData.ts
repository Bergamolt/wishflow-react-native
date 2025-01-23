import { useState, useCallback, useEffect } from 'react'
import { Feature, Vote } from '../types'
import { fetchFeatures, createFeature, voteFeature, fetchVotes } from '../api'
import { WishFlow } from '../config'

export const useData = () => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loaded, setLoaded] = useState(false)
  const { userInfo, appId, locale } = WishFlow.config

  const loadFeatures = useCallback(async () => {
    try {
      const fetchedFeatures = await fetchFeatures(locale)
      setFeatures(fetchedFeatures)
    } catch (error) {
      console.error('Error loading features:', error)
    }
  }, [locale])

  const addFeature = useCallback(
    async (feature: Omit<Feature, 'id' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newFeature = await createFeature(feature)
        setFeatures((prev) => [...prev, newFeature])
        return newFeature
      } catch (error) {
        console.error('Error adding feature:', error)

        throw error
      }
    },
    [],
  )

  const vote = useCallback(
    async (featureId: string) => {
      try {
        await voteFeature(featureId)

        if (userInfo?.userId !== undefined) {
          setFeatures((prev) =>
            prev.map((feature) => (feature.id === featureId ? { ...feature, votes: feature.votes + 1 } : feature)),
          )

          const newVote = {
            featureId,
            userId: userInfo.userId,
            appId,
            createdAt: Date.now(),
          }

          setVotes((prev) => prev.concat(newVote))
        }
      } catch (error) {
        console.error('Error voting for feature:', error)
        throw error
      }
    },
    [appId, userInfo?.userId],
  )

  const loadVotes = useCallback(async () => {
    try {
      const allVotes = await fetchVotes()
      setVotes(allVotes)
    } catch (error) {
      console.error('Error loading votes:', error)
    }
  }, [])

  const refresh = useCallback(() => {
    loadVotes()
    loadFeatures()
  }, [loadVotes, loadFeatures])

  useEffect(() => {
    const init = async () => {
      await loadVotes()
      await loadFeatures()

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
