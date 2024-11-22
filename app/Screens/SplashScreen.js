import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, ImageBackground } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  const [loading, setLoading] = useState(true);
  const [progress] = useState(new Animated.Value(0));

  const loadResourcesAsync = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); // Simulating a 2-second loading time
    });
  };

  useEffect(() => {
    const startLoading = async () => {
      await loadResourcesAsync();
      setLoading(false);
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(() => {
        onFinish();
      });
    };

    startLoading();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/splashscreen.png')} 
      style={styles.container}
      resizeMode="cover" // Adjusts how the image should be resized
    >
      {/* <ActivityIndicator size="large" color="#0a0a0a" /> */}
      <Animated.View style={[styles.progressBar, { width: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
      }) }]} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#0a0a0a', // Change text color for better visibility
  },
  progressBar: {
    height: 5,
    backgroundColor: '#0a0a0a', // Change progress bar color for contrast
    position: 'absolute',
    bottom: 30,
    left: 0,
  },
});

export default SplashScreen;
