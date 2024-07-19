import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import PlayVideoList from '../Screen/HomeScreen/PlayVideoList';
import OtherUserProfile from '../Screen/OtherUserProfile/OtherUserProfile';

const Stack = createStackNavigator();
export default function HomeScreenStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='home' component={HomeScreen} />
      <Stack.Screen name='play-video' component={PlayVideoList} />
      <Stack.Screen name='other-user' component={OtherUserProfile} />
    </Stack.Navigator>
  )
}