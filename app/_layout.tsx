import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
  
  return (
    <>
      <StatusBar hidden={true} />
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
    </>
  );
}
