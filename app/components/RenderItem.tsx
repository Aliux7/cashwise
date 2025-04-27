import { Text, View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

interface Data {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

type Props = {
  item: Data;
  index: number;
};

const RenderItem = ({ item, index }: Props) => {
  const formatToRupiah = (value: string) => {
    const numberOnly = value.replace(/\D/g, "");
    return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <Animated.View
      className="flex-row justify-between items-center py-4 border-b border-blue-50"
      entering={FadeInDown.delay(index * 200)}
      exiting={FadeOutDown}
    >
      <View className="flex flex-row justify-start items-center gap-3">
        <View
          className="w-7 h-7 rounded-md"
          style={{ backgroundColor: item.color }}
        />
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
      </View>
      <Text className="text-base text-red-600">
        - Rp. {formatToRupiah(String(item.value))}
        <Text className="text-gray-500 text-xs"> ({item.percentage}%)</Text>
      </Text>
    </Animated.View>
  );
};

export default RenderItem;
