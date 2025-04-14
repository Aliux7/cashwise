import { Text, View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

interface Data {
  value: number;
  percentage: number;
  color: string;
}

type Props = {
  item: Data;
  index: number;
};

const RenderItem = ({ item, index }: Props) => {
  //  <Animated.View
  //                     key={index}
  //                     className="flex-row justify-between items-center py-3 border-b border-blue-50"
  //                     entering={FadeInDown.delay(index * 200)}
  //                     exiting={FadeOutDown}
  //                   >
  //                     <View>
  //                       <Text className="text-lg text-black">{item.title}</Text>
  //                       <Text className="text-sm text-gray-400">
  //                         {item.date} - {item.category}
  //                       </Text>
  //                     </View>
  //                     <Text
  //                       className={`text-base font-semibold ${
  //                         item.amount > 0 ? "text-green-500" : "text-red-500"
  //                       }`}
  //                     >
  //                       {item.amount > 0
  //                         ? `+Rp. ${item.amount}`
  //                         : `-Rp. ${Math.abs(item.amount)}`}
  //                     </Text>
  //                   </Animated.View>
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
          <Text className="text-lg font-bold text-gray-800">Category Name</Text>
        </View>
        <Text className="text-base text-gray-800">
          Rp. {item.value} ({item.percentage}%)
        </Text> 
    </Animated.View>
  );
};

export default RenderItem;
