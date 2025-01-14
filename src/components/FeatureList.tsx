import React from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { FeatureListProps } from '../types'
import { FeatureItem } from './FeatureItem'
import { STATUS_TEXT, THEME } from '../constants'
import { WishFlow } from '../config'

export const FeatureList: React.FC<FeatureListProps> = ({ status, features, onVote, loading }) => {
  if (loading) {
    return (
      <View
        style={[
          defaultStyles.container,
          defaultStyles.centerContent,
          WishFlow.config?.styles?.FeatureList?.container,
          WishFlow.config?.styles?.FeatureList?.centerContent,
        ]}>
        <ActivityIndicator color={THEME.PRIMARY_COLOR} size='large' />
      </View>
    )
  }

  if (features.length === 0) {
    return (
      <View
        style={[
          defaultStyles.container,
          defaultStyles.centerContent,
          WishFlow.config?.styles?.FeatureList?.container,
          WishFlow.config?.styles?.FeatureList?.centerContent,
        ]}>
        <View style={[defaultStyles.emptyStateContainer, WishFlow.config?.styles?.FeatureList?.emptyStateContainer]}>
          <Text style={[defaultStyles.emptyStateText, WishFlow.config?.styles?.FeatureList?.emptyStateText]}>
            {status === 'ALL' ? 'No features found' : `No ${STATUS_TEXT[status].toLowerCase()} features`}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[defaultStyles.container, WishFlow.config?.styles?.FeatureList?.container]}>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeatureItem key={item.id} feature={item} onVote={onVote} />}
        contentContainerStyle={[defaultStyles.listContainer, WishFlow.config?.styles?.FeatureList?.listContainer]}
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
