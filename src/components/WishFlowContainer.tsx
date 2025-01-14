import React, { useState } from 'react'
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native'
import { WishFlowContainerProps, Feature, FeatureStatus } from '../types'
import { FeatureList } from './FeatureList'
import { AddFeatureModal } from './AddFeatureModal'
import { useWishFlow } from '../hooks/useWishFlow'
import { STATUS_TEXT, THEME } from '../constants'
import { WishFlow } from '../config'

type StatusFilter = FeatureStatus | 'ALL'

const STATUS_OPTIONS: StatusFilter[] = ['ALL', ...Object.values(FeatureStatus)]

export const WishFlowContainer: React.FC<WishFlowContainerProps> = ({ theme }) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  const { features, loading, addFeature, vote } = useWishFlow()

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

  const customTheme = {
    primaryColor: theme?.primaryColor || THEME.PRIMARY_COLOR,
    backgroundColor: theme?.backgroundColor || THEME.BACKGROUND_COLOR,
    textColor: theme?.textColor || THEME.TEXT_COLOR,
  }

  if (loading) {
    return (
      <View
        style={[
          WishFlow.config?.styles?.WishFlowContainer?.container,
          WishFlow.config?.styles?.WishFlowContainer?.centerContent,
        ]}>
        <ActivityIndicator color={customTheme.primaryColor} size='large' />
      </View>
    )
  }

  return (
    <View style={WishFlow.config?.styles?.WishFlowContainer?.container}>
      <View style={WishFlow.config?.styles?.WishFlowContainer?.filterContainer}>
        <Pressable
          style={WishFlow.config?.styles?.WishFlowContainer?.dropdown}
          onPress={() => setDropdownVisible(!isDropdownVisible)}>
          <Text style={WishFlow.config?.styles?.WishFlowContainer?.dropdownText}>{STATUS_TEXT[selectedStatus]}</Text>
          <Text style={WishFlow.config?.styles?.WishFlowContainer?.dropdownArrow}>{isDropdownVisible ? '▲' : '▼'}</Text>
        </Pressable>

        {isDropdownVisible && (
          <View style={WishFlow.config?.styles?.WishFlowContainer?.dropdownMenu}>
            {STATUS_OPTIONS.map((status) => (
              <Pressable
                key={status}
                style={WishFlow.config?.styles?.WishFlowContainer?.dropdownItem}
                onPress={() => {
                  setSelectedStatus(status)
                  setDropdownVisible(false)
                }}>
                <Text
                  style={[
                    WishFlow.config?.styles?.WishFlowContainer?.dropdownItemText,
                    selectedStatus === status && WishFlow.config?.styles?.WishFlowContainer?.dropdownItemTextActive,
                  ]}>
                  {STATUS_TEXT[status]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <FeatureList status={selectedStatus} features={filteredFeatures} loading={loading} onVote={vote} />

      <Pressable style={WishFlow.config?.styles?.WishFlowContainer?.addButton} onPress={() => setModalVisible(true)}>
        <Text style={WishFlow.config?.styles?.WishFlowContainer?.addButtonText}>+</Text>
      </Pressable>

      <AddFeatureModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddFeature} />
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
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    color: THEME.BACKGROUND_COLOR,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
    color: THEME.TEXT_COLOR,
  },
  dropdownArrow: {
    fontSize: 14,
    color: THEME.TEXT_COLOR,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 66,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
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
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: THEME.TEXT_COLOR,
  },
  dropdownItemTextActive: {
    color: THEME.PRIMARY_COLOR,
    fontWeight: '600',
  },
})
