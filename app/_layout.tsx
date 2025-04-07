import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack>
    </GestureHandlerRootView>
  );
}
