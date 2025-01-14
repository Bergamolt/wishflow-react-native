import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { VoteButtonProps } from '../types'
import { THEME } from '../constants'
import { WishFlow } from '../config'

export const VoteButton: React.FC<VoteButtonProps> = ({ votes, onPress }) => {
  return (
    <Pressable style={[WishFlow.config?.styles?.VoteButton?.container]} onPress={onPress}>
      {WishFlow.config?.customComponents?.VoteButton?.customIcon || (
        <Text style={[WishFlow.config?.styles?.VoteButton?.icon]}>👍</Text>
      )}
      <Text style={[WishFlow.config?.styles?.VoteButton?.text]}>{votes}</Text>
    </Pressable>
  )
}

export const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    justifyContent: 'center',
  },
  text: {
    color: THEME.BACKGROUND_COLOR,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  icon: {
    fontSize: 16,
  },
})
