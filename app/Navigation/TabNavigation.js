import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import HomeScreen from '../Screens/HomeScreen';
import About from '../Screens/AboutScreen';
import Profile from '../Screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute', bottom: 0, height: 65, paddingBottom: 10 },
      }}
    >
      <Tab.Screen 
        name='Home' 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: () => <Text style={{ fontSize: 16 }}>Home</Text>,
        }}
      />
      <Tab.Screen 
        name='Profile' 
        component={Profile} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: () => <Text style={{ fontSize: 16 }}>Profile</Text>,
        }} 
      />
      <Tab.Screen 
        name='About' 
        component={About} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: () => <Text style={{ fontSize: 16 }}>About</Text>,
        }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
