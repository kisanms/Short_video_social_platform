// Import necessary components and functions from react-native and expo-font
import { SafeAreaView, StatusBar, Text, View, ActivityIndicator } from "react-native";
import { useFonts } from 'expo-font';
import LoginScreen from "./Screen/LoginScreen/LoginScreen";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import HomeScreen from "./Screen/HomeScreen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Navigations/TabNavigation";

export default function Index() {
  // Load the fonts using the useFonts hook
  const [fontsLoaded, fontError] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  // Check if fonts are not loaded and render a loading indicator
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render the LoginScreen component if fonts are loaded
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <SignedIn>
          <NavigationContainer independent={true}>
            <TabNavigation />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </SafeAreaView>
    </ClerkProvider>
  );
}
