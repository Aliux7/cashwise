import { Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

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
  const { width } = useWindowDimensions();

  return (
    <Animated.View
      className="py-2 mb-2 bg-gray-50 rounded-md"
      entering={FadeInDown.delay(index * 200)}
      exiting={FadeOutDown}
    >
      <View className="flex-row items-center justify-between gap-2 mx-5">
        <View
          className="w-5 h-5 rounded-md"
          style={{ backgroundColor: item.color }}
        />
        <Text className="text-base font-bold text-black">
          Category Name
        </Text>
        <Text className="text-bas text-gray-800">
          {item.percentage}%
        </Text>
        <Text className="text-base text-gray-800">
          Rp. {item.value}
        </Text>
      </View>
    </Animated.View>
  );
};

export default RenderItem;
