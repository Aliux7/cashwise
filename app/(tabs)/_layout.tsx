import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  Image,
  processColor,
  TouchableOpacityProps,
} from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import homeIcon from "@/assets/icons/home.png";
import transactionIcon from "@/assets/icons/transfer.png";
import investmentIcon from "@/assets/icons/invest.png";
import addIcon from "@/assets/icons/add.png";
import todoIcon from "@/assets/icons/todo.png";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";
import NumPad from "../components/NumPad";

function TabIcon({ focused, icon, title }: any) {
  if (focused) {
    return (
      <ImageBackground className="bg-transparent min-w-20 flex flex-col w-full flex-1 min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden">
        <Image source={icon} tintColor="#51A2FF" className="size-6" />
        <Text className="text-xs text-[0.6rem] font-semibold text-nowrap text-blue-400">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View className="bg-transparent size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#99A1AF" className="size-6" />
    </View>
  );
}

const _layout = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const toggleAddModal = () => {
    setAddModalVisible(!isAddModalVisible);
  };

  const CustomAddButton = ({ onPress }: any) => (
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
        <Tabs.Screen
          name="index"
          options={{
            title: "index",
            headerShown: false,
            tabBarIcon: ({ focused }: any) => (
              <TabIcon focused={focused} icon={homeIcon} title="Home" />
            ),
            tabBarButton: (props: any) => (
              <TouchableOpacity {...(props as TouchableOpacityProps)} />
            ),
          }}
        />

        <Tabs.Screen
          name="cashflow"
          options={{
            title: "Cashflow",
            headerShown: false,
            tabBarIcon: ({ focused }: any) => (
              <TabIcon
                focused={focused}
                icon={transactionIcon}
                title="Cashflow"
              />
            ),
            tabBarButton: (props: any) => (
              <TouchableOpacity {...(props as TouchableOpacityProps)} />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => <CustomAddButton onPress={toggleAddModal} />,
          }}
        />

        <Tabs.Screen
          name="portofolio"
          options={{
            title: "Portofolio",
            headerShown: false,
            tabBarIcon: ({ focused }: any) => (
              <TabIcon
                focused={focused}
                icon={investmentIcon}
                title="Portofolio"
              />
            ),
            tabBarButton: (props: any) => (
              <TouchableOpacity {...(props as TouchableOpacityProps)} />
            ),
          }}
        />

        <Tabs.Screen
          name="todo"
          options={{
            title: "Todo",
            headerShown: false,
            tabBarIcon: ({ focused }: any) => (
              <TabIcon focused={focused} icon={todoIcon} title="Todo" />
            ),
            tabBarButton: (props: any) => (
              <TouchableOpacity {...(props as TouchableOpacityProps)} />
            ),
          }}
        />
      </Tabs>
      <Modal
        isVisible={isAddModalVisible}
        onBackdropPress={toggleAddModal}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View className="bg-white rounded-t-2xl p-5">
          <NumPad onClose={toggleAddModal} />
        </View>
      </Modal>
    </>
  );
};

export default _layout;
