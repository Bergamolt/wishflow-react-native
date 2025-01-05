import { useState, useCallback, useEffect } from 'react'
import { Feature } from '../types'
import { fetchFeatures, createFeature, voteFeature } from '../utils/api'
import { DEFAULT_LOCALE, WishFlow } from '../config'

export const useWishFlow = () => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [votedFeatureIds, setVotedFeatureIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const currentLocale = WishFlow.config.locale || DEFAULT_LOCALE

  const loadFeatures = useCallback(async () => {
    try {
      try {
        WishFlow.config
        setIsInitialized(true)
      } catch {
        setIsInitialized(false)
        return
      }

      setLoading(true)

      const fetchedFeatures = await fetchFeatures(currentLocale)

      setFeatures(fetchedFeatures)
    } catch (error) {
      console.error('Error loading features:', error)
    } finally {
      setLoading(false)
    }
  }, [currentLocale])

  useEffect(() => {
    loadFeatures()
  }, [loadFeatures, isInitialized])

  const addFeature = async (feature: Omit<Feature, 'id' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newFeature = await createFeature(feature)
      setFeatures((prev) => [...prev, newFeature])
      return newFeature
    } catch (error) {
      console.error('Error adding feature:', error)
      throw error
    }
  }

  const vote = async (featureId: string) => {
    try {
      await voteFeature(featureId)

      setVotedFeatureIds((prev) => [...prev, featureId])
      setFeatures((prev) =>
        prev.map((feature) => (feature.id === featureId ? { ...feature, votes: feature.votes + 1 } : feature)),
      )
    } catch (error) {
      console.error('Error voting for feature:', error)
      throw error
    }
  }

  return {
    features,
    votedFeatureIds,
    loading,
    addFeature,
    vote,
    refresh: loadFeatures,
  }
}
