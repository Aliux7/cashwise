import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";

const profile = () => {
  const router = useRouter();
 
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout(); 
  };

  const handleBack = () => {
    router.push("/");  
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-5">
      <Text className="text-xl font-semibold mb-4">profile</Text>
      <Text className="text-lg mb-2">Name: {user?.name}</Text>
      <Text className="text-lg mb-6">Email: {user?.email}</Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-full mb-4"
      >
        <Text className="text-white text-base font-medium">Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleBack}
        className="bg-blue-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-base font-medium">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default profile;
