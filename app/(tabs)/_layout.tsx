import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  TouchableOpacityProps,
} from "react-native";

import React, { useEffect, useState } from "react";
import { Redirect, Tabs } from "expo-router";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

import homeIcon from "@/assets/icons/home.png";
import transactionIcon from "@/assets/icons/transfer.png";
import investmentIcon from "@/assets/icons/invest.png";
import addIcon from "@/assets/icons/add.png";
import calculatorIcon from "@/assets/icons/calculator.png";
import NumPad from "../components/NumPad";
import { useAuthStore } from "@/store/useAuthStore";

type TabIconProps = {
  focused: boolean;
  icon: any;
  title: string;
};

const TabIcon = ({ focused, icon, title }: TabIconProps) =>
  focused ? (
    <ImageBackground className="bg-transparent min-w-20 flex flex-col w-full flex-1 min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden">
      <Image source={icon} tintColor="#51A2FF" className="size-6" />
      <Text className="text-xs text-[0.6rem] font-semibold text-nowrap text-blue-400">
        {title}
      </Text>
    </ImageBackground>
  ) : (
    <View className="bg-transparent size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#99A1AF" className="size-6" />
    </View>
  );

const CustomAddButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className="absolute -top-8 justify-center items-center bg-white rounded-full p-1.5 border-x border-blue-50"
  >
    <View className="w-16 h-16 rounded-full justify-center items-center shadow-xl overflow-hidden">
      <LinearGradient
        colors={["#2B7FFF", "#BEDBFF"]}
        start={[0, 1]}
        end={[1, 0]}
        className="w-16 h-16 rounded-full justify-center items-center shadow-xl"
      >
        <Image source={addIcon} tintColor="white" className="size-8" />
      </LinearGradient>
    </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const user = useAuthStore((state) => state.user);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const toggleAddModal = () => setAddModalVisible(!isAddModalVisible);

  const screenTab = (name: string, icon: any, label: string) => ({
    name,
    options: {
      headerShown: false,
      tabBarIcon: ({ focused }: any) => (
        <TabIcon focused={focused} icon={icon} title={label} />
      ),
      tabBarButton: (props: any) => (
        <TouchableOpacity {...(props as TouchableOpacityProps)} />
      ),
    },
  });

  if (!user) {
    return <Redirect href="/landing" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarPressColor: "transparent",
          tabBarShowLabel: false,
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            backgroundColor: "white",
            borderRadius: 10,
            paddingTop: 5,
            height: 70,
            borderWidth: 1,
            borderColor: "#DBEAFE",
          },
        }}
      >
        <Tabs.Screen {...screenTab("index", homeIcon, "Home")} />
        <Tabs.Screen {...screenTab("cashflow", transactionIcon, "Cashflow")} />
        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => <CustomAddButton onPress={toggleAddModal} />,
          }}
        />
        <Tabs.Screen
          {...screenTab("portofolio", investmentIcon, "Portofolio")}
        />
        <Tabs.Screen
          {...screenTab("calculator", calculatorIcon, "Calculator")}
        />
      </Tabs>

      <Modal
        isVisible={isAddModalVisible}
        onBackdropPress={toggleAddModal}
        style={{ justifyContent: "flex-end", margin: 0 }}
        className=""
      >
        <NumPad onClose={toggleAddModal} email={user?.email || ""} />
      </Modal>
    </>
  );
}
