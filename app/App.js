import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TabNavigation from './Navigation/TabNavigation';
import SplashScreen from './Screens/SplashScreen'; // Adjust the path accordingly

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SplashScreen onFinish={handleFinishLoading} />
      ) : (
        <>
          <TabNavigation />
          <StatusBar style="auto" />
        </>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
});
