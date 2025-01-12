import React from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { FeatureTabProps } from '../types'
import { FeatureItem } from './FeatureItem'
import { THEME } from '../constants'
import { WishFlow } from '../config'

export const FeatureTab: React.FC<FeatureTabProps> = ({ type, features, onVote, loading }) => {
  if (loading) {
    return (
      <View
        style={[WishFlow.config?.styles?.FeatureTab?.container, WishFlow.config?.styles?.FeatureTab?.centerContent]}>
        <ActivityIndicator color={THEME.PRIMARY_COLOR} size='large' />
      </View>
    )
  }

  if (features.length === 0) {
    return (
      <View
        style={[WishFlow.config?.styles?.FeatureTab?.container, WishFlow.config?.styles?.FeatureTab?.centerContent]}>
        <View style={[WishFlow.config?.styles?.FeatureTab?.emptyStateContainer]}>
          <Text style={[WishFlow.config?.styles?.FeatureTab?.emptyStateText]}>
            {type === 'approved' ? 'No approved features' : 'No implemented features'}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[WishFlow.config?.styles?.FeatureTab?.container]}>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeatureItem feature={item} onVote={onVote} />}
        contentContainerStyle={[WishFlow.config?.styles?.FeatureTab?.listContainer]}
      />
    </View>
  )
}

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.BACKGROUND_COLOR,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: THEME.TEXT_COLOR,
    opacity: 0.6,
    textAlign: 'center',
  },
})
