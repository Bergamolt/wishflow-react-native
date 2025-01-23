import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { Theme, VoteButtonProps } from '../types'
import { WishFlow } from '../config'

export const VoteButton: React.FC<VoteButtonProps> = ({ votes, onPress, isVoted }) => {
  return (
    <Pressable style={WishFlow.config.styles.VoteButton.container} onPress={onPress}>
      {WishFlow.config.components?.VoteButton?.customIcon || (
        <Text style={[WishFlow.config.styles.VoteButton.icon, isVoted ? WishFlow.config.styles.VoteButton.voted : {}]}>
          ▲
        </Text>
      )}
      <Text style={[WishFlow.config.styles.VoteButton.text, isVoted ? WishFlow.config.styles.VoteButton.voted : {}]}>
        {votes}
      </Text>
    </Pressable>
  )
}

export const createVoteButtonStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    text: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
    icon: {
      fontSize: 16,
      color: theme.text,
    },
    voted: {
      color: theme.primary,
    },
  })
}
