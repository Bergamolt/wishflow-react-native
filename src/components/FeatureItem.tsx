import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FeatureItemProps } from '../types'
import { VoteButton } from './VoteButton'
import { STATUS_TEXT } from '../constants'
import { WishFlow } from '../config'
import { Theme } from '../types'
import { useWishFlow } from '../context'

export const FeatureItem: React.FC<FeatureItemProps> = ({ feature, onVote }) => {
  const { userInfo } = WishFlow.config
  const { votes } = useWishFlow()

  const isVoted = useMemo(() => {
    if (!votes) {
      return false
    }

    return votes.some((vote) => vote.featureId === feature.id && vote.userId === userInfo?.userId)
  }, [votes, feature.id, userInfo?.userId])

  const handleVote = () => {
    onVote(feature.id)
  }

  return (
    <View style={WishFlow.config.styles.FeatureItem.container}>
      <View style={WishFlow.config.styles.FeatureItem.content}>
        <Text style={WishFlow.config.styles.FeatureItem.title}>{feature.title}</Text>
        <Text style={WishFlow.config.styles.FeatureItem.description} numberOfLines={1} ellipsizeMode='tail'>
          {feature.description}
        </Text>
        <View
          style={[
            WishFlow.config.styles.FeatureItem.status,
            { backgroundColor: WishFlow.config.statusColors[feature.status] },
          ]}>
          <Text style={WishFlow.config.styles.FeatureItem.statusText}>{STATUS_TEXT[feature.status]}</Text>
        </View>
      </View>
      <View style={WishFlow.config.styles.FeatureItem.votesContainer}>
        <VoteButton votes={feature.votes} onPress={handleVote} isVoted={isVoted} />
      </View>
    </View>
  )
}

export const createFeatureItemStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.background,
      borderRadius: 8,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: theme.shadow,
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
      color: theme.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.8,
      marginBottom: 8,
    },
    metadata: {
      fontSize: 12,
      color: theme.text,
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
      color: theme.text,
    },
    votesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}
