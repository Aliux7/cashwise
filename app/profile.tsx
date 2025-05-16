import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import backIcon from "@/assets/icons/back.png";
import logoutIcon from "@/assets/icons/logout.png";
import profileIcon from "@/assets/icons/user.png";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";

const profile = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/landing");
  };

  const handleBack = () => {
    router.push("/");
  };

  if (!user) {
    return <Redirect href="/landing" />;
  }

  return (
    <View className="flex-1 justify-start items-center bg-white">
      <LinearGradient
        colors={["#FFFFFF", "#DBEAFE", "#EFF6FF", "#EFF6FF", "#FFFFFF"]}
        start={[1, 0]}
        end={[1, 1]}
        className="flex flex-col justify-between items-center flex-1 w-full"
      >
        <View className="flex flex-col py-10 px-5 justify-start items-center gap-3 w-full">
          <View className="border rounded-full p-1 border-blue-400 ">
            <Image
              source={profileIcon}
              style={{ tintColor: "#51A2FF" }}
              className="size-10"
            />
          </View>
          <View className="flex flex-col justify-center items-center">
            <Text className="capitalize text-xl">{user?.name}</Text>
            <Text className="text-gray-500 text-sm">{user?.email}</Text>
          </View>
          <TouchableOpacity
            onPress={handleBack}
            className="p-2 rounded-full absolute top-4 left-4 flex flex-row justify-center items-center gap-1"
          >
            <Image
              source={backIcon}
              style={{ tintColor: "#6b7280" }}
              className="size-4"
            />
            <Text className="text-gray-500 text-lg">Back</Text>
          </TouchableOpacity>
        </View>

        <View className="my-10 w-full px-8 ">
          <TouchableOpacity
            onPress={handleLogout}
            className="px-5 py-3 flex flex-row justify-start items-center gap-3 border-y border-gray-300"
          >
            <Image
              source={logoutIcon}
              style={{ tintColor: "#374151" }}
              className="size-5"
            />
            <Text className="text-gray-700 text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default profile;
