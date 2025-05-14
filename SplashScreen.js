// SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo zoom-in
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Fade in "Loading..." text
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./assets/homecare.jpg')}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
        Loading...
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#4B5563',
  },
});
