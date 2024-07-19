import { View, Text, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import SearchScreen from '../Screen/Search/SearchScreen';
import AddScreen from '../Screen/Add/AddScreen';
import ProfileScreen from '../Screen/Profile/ProfileScreen';
import Colors from '../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';
import AddScreenNavigation from './AddScreenNavigation';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import HomeScreenStackNavigation from './HomeScreenStackNavigation';
const Tab = createBottomTabNavigator();
export default function TabNavigation() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.BLACK, headerShown: false, tabBarLabelStyle: {
            fontFamily: 'outfit-medium',
            fontSize: heightPercentageToDP(1.74),
          },
        }}>
        <Tab.Screen name='Home' component={HomeScreenStackNavigation} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={30} color="color" />
          )
        }} />

        <Tab.Screen name='Add' component={AddScreenNavigation} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={30} color="color" />
          )
        }} />
        <Tab.Screen name='Profile' component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-circle" size={30} color="black" />
            )
          }} />
      </Tab.Navigator>
    </SafeAreaView>
  )
}