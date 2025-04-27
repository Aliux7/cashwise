import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#FFFFFF",
            },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="landing" />
          <Stack.Screen name="profile" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
