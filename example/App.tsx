/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {WishFlow, WishFlowContainer} from 'react-native-wishflow';

import { Colors } from 'react-native/Libraries/NewAppScreen';

WishFlow.setConfig({
  secretKey: '00862c40cca2b884ea0a6c59f6c9f22fca94e9d5bba3d6b94c6d41eab08005ab',
  appId: '4SJhh46g1tYVXPyLYQBL',
  userId: 'test_user_id',
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <WishFlowContainer />
    </SafeAreaView>
  );
}

export default App;
