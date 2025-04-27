import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import { Timestamp } from "firebase/firestore";

interface LongPressProps {
  item: any;
  index: number;
  onLongPress: (transaction: any) => void;
}

const LongPress: React.FC<LongPressProps> = ({ item, index, onLongPress }) => {
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return "Today";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatToRupiah = (value: string) => {
    const numberOnly = value.replace(/\D/g, "");
    return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === 4) {
          // Long press detected
          onLongPress(item);
        }
      }}
    >
      <Animated.View
        key={index}
        className="flex-row justify-between items-center py-3 border-b border-blue-50"
        entering={FadeInDown.delay(index * 200)}
        exiting={FadeOutDown}
      >
        <View>
          <Text className="text-lg text-black">{item.title}</Text>
          <Text className="text-sm text-gray-400">
            {formatDate(item.date)} - {item.category}
          </Text>
        </View>
        <Text
          className={`text-base font-semibold ${
            item.type === "Income" ? "text-green-500" : "text-red-500"
          }`}
        >
          {item.type === "Income" ? "+" : "-"}Rp.{" "}
          {formatToRupiah(String(item?.amount))}
        </Text>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

export default LongPress;
