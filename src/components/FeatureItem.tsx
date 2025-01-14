import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FeatureItemProps } from '../types'
import { VoteButton } from './VoteButton'
import { STATUS_TEXT, statusColors, THEME } from '../constants'
import { WishFlow } from '../config'
import { truncate } from '../utils/truncate'

const MAX_DESCRIPTION_LENGTH = 35

export const FeatureItem: React.FC<FeatureItemProps> = ({ feature, onVote }) => {
  const handleVote = () => {
    onVote(feature.id)
  }

  return (
    <View style={[WishFlow.config?.styles?.FeatureItem?.container]}>
      <View style={WishFlow.config?.styles?.FeatureItem?.content}>
        <Text style={[WishFlow.config?.styles?.FeatureItem?.title]}>{feature.title}</Text>
        <Text style={[WishFlow.config?.styles?.FeatureItem?.description]}>
          {truncate(feature.description, MAX_DESCRIPTION_LENGTH)}
        </Text>
        <View style={[WishFlow.config?.styles?.FeatureItem?.status, { backgroundColor: statusColors[feature.status] }]}>
          <Text style={[WishFlow.config?.styles?.FeatureItem?.statusText]}>{STATUS_TEXT[feature.status]}</Text>
        </View>
      </View>
      <View style={[WishFlow.config?.styles?.FeatureItem?.votesContainer]}>
        <VoteButton votes={feature.votes} onPress={handleVote} />
      </View>
    </View>
  )
}

export const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: THEME.BACKGROUND_COLOR,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.TEXT_COLOR,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: THEME.TEXT_COLOR,
    opacity: 0.8,
    marginBottom: 8,
  },
  metadata: {
    fontSize: 12,
    color: THEME.TEXT_COLOR,
    opacity: 0.6,
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: THEME.TEXT_COLOR,
  },
  votesContainer: {
    justifyContent: 'center',
  },
})
