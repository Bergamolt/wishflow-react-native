import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { WishFlowProvider } from 'wishflow-react-native'

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <WishFlowProvider config={{
        secretKey: 'fb529541eb769f6f33468a923afd3203d0b2ebbeee1c611966212c512403a34c',
        appId: 'FH89V3n2lS2dO48cxXY7',
        userInfo: {
          userId: '123',
          email: 'test@test.com',
          name: 'Test User',
        },
        styles: {
          WishFlowContainer: {
            flex: 1,
          },
        },
      }} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
