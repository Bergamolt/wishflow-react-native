import React, { useState } from 'react'
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native'
import { Feature, FeatureStatus, Theme } from '../types'
import { FeatureList } from './FeatureList'
import { AddFeatureModal } from './AddFeatureModal'
import { useWishFlow } from '../context'
import { STATUS_TEXT } from '../constants'
import { WishFlow } from '../config'

type StatusFilter = FeatureStatus | 'ALL'

const STATUS_OPTIONS: StatusFilter[] = ['ALL', ...Object.values(FeatureStatus)]

export const WishFlowContainer = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  const { features, addFeature, vote, loaded } = useWishFlow()

  const filteredFeatures = features.filter((feature) => {
    const ownFeature = feature.userId === WishFlow.config.userInfo?.userId

    if (selectedStatus === 'ALL') {
      return true
    }

    return feature.status === selectedStatus || ownFeature
  })

  const handleAddFeature = async (feature: Omit<Feature, 'id' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addFeature(feature)
      setModalVisible(false)
    } catch (error) {
      console.error('Error adding feature:', error)
      // TODO: Add error handling
    }
  }

  if (!loaded) {
    return (
      <View
        style={[
          WishFlow.config.styles.WishFlowContainer.container,
          WishFlow.config.styles.WishFlowContainer.centerContent,
        ]}>
        <ActivityIndicator color={WishFlow.config.theme.primary} size='large' />
      </View>
    )
  }

  return (
    <View style={WishFlow.config.styles.WishFlowContainer.container}>
      <View style={WishFlow.config.styles.WishFlowContainer.filterContainer}>
        <Pressable
          style={WishFlow.config.styles.WishFlowContainer.dropdown}
          onPress={() => setDropdownVisible(!isDropdownVisible)}>
          <Text style={WishFlow.config.styles.WishFlowContainer.dropdownText}>{STATUS_TEXT[selectedStatus]}</Text>
          <Text style={WishFlow.config.styles.WishFlowContainer.dropdownArrow}>{isDropdownVisible ? '▲' : '▼'}</Text>
        </Pressable>

        {isDropdownVisible && (
          <View style={WishFlow.config.styles.WishFlowContainer.dropdownMenu}>
            {STATUS_OPTIONS.map((status) => (
              <Pressable
                key={status}
                style={WishFlow.config.styles.WishFlowContainer.dropdownItem}
                onPress={() => {
                  setSelectedStatus(status)
                  setDropdownVisible(false)
                }}>
                <Text
                  style={[
                    WishFlow.config.styles.WishFlowContainer.dropdownItemText,
                    selectedStatus === status && WishFlow.config.styles.WishFlowContainer.dropdownItemTextActive,
                  ]}>
                  {STATUS_TEXT[status]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <FeatureList status={selectedStatus} features={filteredFeatures} loading={!loaded} onVote={vote} />

      <Pressable style={WishFlow.config.styles.WishFlowContainer.addButton} onPress={() => setModalVisible(true)}>
        <Text style={WishFlow.config.styles.WishFlowContainer.addButtonText}>+</Text>
      </Pressable>

      <AddFeatureModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddFeature} />
    </View>
  )
}

export const createWishFlowContainerStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    addButtonText: {
      fontSize: 32,
      color: theme.background,
      marginTop: -2,
    },
    filterContainer: {
      padding: 16,
      zIndex: 1,
    },
    dropdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.text,
    },
    dropdownArrow: {
      fontSize: 14,
      color: theme.text,
    },
    dropdownMenu: {
      position: 'absolute',
      top: 66,
      left: 16,
      right: 16,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    dropdownItemText: {
      fontSize: 16,
      color: theme.text,
    },
    dropdownItemTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
  })
}
