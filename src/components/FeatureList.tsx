import React from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { FeatureListProps, Theme } from '../types'
import { FeatureItem } from './FeatureItem'
import { STATUS_TEXT } from '../constants'
import { WishFlow } from '../config'
import { useData } from '../hooks/useData'

export const FeatureList: React.FC<FeatureListProps> = ({ status, features, onVote, loading }) => {
  const { refresh } = useData()

  if (loading) {
    return (
      <View style={[WishFlow.config.styles.FeatureList.container, WishFlow.config.styles.FeatureList.centerContent]}>
        <ActivityIndicator color={WishFlow.config.theme.primary} size='large' />
      </View>
    )
  }

  if (features.length === 0) {
    return (
      <View style={[WishFlow.config.styles.FeatureList.container, WishFlow.config.styles.FeatureList.centerContent]}>
        <View style={WishFlow.config.styles.FeatureList.emptyStateContainer}>
          <Text style={WishFlow.config.styles.FeatureList.emptyStateText}>
            {status === 'ALL' ? 'No features found' : `No ${STATUS_TEXT[status].toLowerCase()} features`}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={WishFlow.config.styles.FeatureList.container}>
      <FlatList
        data={features}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <FeatureItem key={String(item.id)} feature={item} onVote={onVote} />}
        contentContainerStyle={WishFlow.config.styles.FeatureList.listContainer}
        refreshing={loading}
        onRefresh={refresh}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
    </View>
  )
}

export const createFeatureListStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.text,
      opacity: 0.6,
      textAlign: 'center',
    },
  })
}
