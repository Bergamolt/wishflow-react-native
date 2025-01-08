import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { WishFlowContainerProps, Feature, FeatureStatus } from '../types';
import { FeatureTab } from './FeatureTab';
import { AddFeatureModal } from './AddFeatureModal';
import { useWishFlow } from '../hooks/useWishFlow';
import { THEME } from '../constants';
import { WishFlow } from '../config';

type TabType = 'approved' | 'implemented';

const getTabType = (status: FeatureStatus): TabType => {
  if (status === FeatureStatus.COMPLETED) {
    return 'implemented';
  }

  return 'approved';
};

export const WishFlowContainer: React.FC<WishFlowContainerProps> = ({
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('approved');
  const [isModalVisible, setModalVisible] = useState(false);

  const { features, loading, addFeature, vote } = useWishFlow();

  const filteredFeatures = features.filter((feature) => {
    const tabStatus = getTabType(feature.status);
    const ownFeature = feature.userId === WishFlow.config.userId;

    if (tabStatus === 'implemented' && !ownFeature) {
      return true;
    }

    return tabStatus === activeTab || ownFeature;
  });

  const handleAddFeature = async (
    feature: Omit<
      Feature,
      'id' | 'status' | 'votes' | 'createdAt' | 'updatedAt'
    >
  ) => {
    try {
      await addFeature(feature);
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding feature:', error);
      // TODO: Add error handling
    }
  };

  const customTheme = {
    primaryColor: theme?.primaryColor || THEME.PRIMARY_COLOR,
    backgroundColor: theme?.backgroundColor || THEME.BACKGROUND_COLOR,
    textColor: theme?.textColor || THEME.TEXT_COLOR,
  };

  if (loading) {
    return (
      <View
        style={[
          WishFlow.config?.styles?.WishFlowContainer?.container,
          WishFlow.config?.styles?.WishFlowContainer?.centerContent,
        ]}
      >
        <ActivityIndicator color={customTheme.primaryColor} size="large" />
      </View>
    );
  }

  return (
    <View style={WishFlow.config?.styles?.WishFlowContainer?.container}>
      <View style={WishFlow.config?.styles?.WishFlowContainer?.tabBar}>
        <Pressable
          style={[
            WishFlow.config?.styles?.WishFlowContainer?.tab,
            activeTab === 'approved' &&
              WishFlow.config?.styles?.WishFlowContainer?.activeTab,
          ]}
          onPress={() => setActiveTab('approved')}
        >
          <Text
            style={[
              WishFlow.config?.styles?.WishFlowContainer?.tabLabel,
              activeTab === 'approved' &&
                WishFlow.config?.styles?.WishFlowContainer?.activeTabLabel,
            ]}
          >
            Approved
          </Text>
        </Pressable>
        <Pressable
          style={[
            WishFlow.config?.styles?.WishFlowContainer?.tab,
            activeTab === 'implemented' &&
              WishFlow.config?.styles?.WishFlowContainer?.activeTab,
          ]}
          onPress={() => setActiveTab('implemented')}
        >
          <Text
            style={[
              WishFlow.config?.styles?.WishFlowContainer?.tabLabel,
              activeTab === 'implemented' &&
                WishFlow.config?.styles?.WishFlowContainer?.activeTabLabel,
            ]}
          >
            Implemented
          </Text>
        </Pressable>
      </View>

      <FeatureTab
        type={activeTab}
        features={filteredFeatures}
        loading={loading}
        onVote={vote}
      />

      <Pressable
        style={WishFlow.config?.styles?.WishFlowContainer?.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={WishFlow.config?.styles?.WishFlowContainer?.addButtonText}>
          +
        </Text>
      </Pressable>

      <AddFeatureModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddFeature}
      />
    </View>
  );
};

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.BACKGROUND_COLOR,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: THEME.BACKGROUND_COLOR,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.PRIMARY_COLOR,
  },
  tabLabel: {
    fontSize: 16,
    color: THEME.TEXT_COLOR,
    opacity: 0.7,
  },
  activeTabLabel: {
    opacity: 1,
    fontWeight: '600',
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
});
