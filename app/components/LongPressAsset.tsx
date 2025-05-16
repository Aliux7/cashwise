import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { LongPressGestureHandler } from "react-native-gesture-handler";

type Asset = {
  id: string;
  assetId: string;
  email: string;
  lot: number;
  category: string;
  symbol: string;
  name: string;
  current_price: string;
  image: string;
};

interface LongPressAssetProps {
  item: Asset;
  index: number;
  onLongPress: (asset: Asset) => void;
}

const LongPressAsset: React.FC<LongPressAssetProps> = ({
  item,
  index,
  onLongPress,
}) => {
  const formatNumberWithDots = (amount: number) => {
    return amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === 4) {
          onLongPress(item);
        }
      }}
    >
      <Animated.View
        key={index}
        className="flex flex-row items-center justify-between border-b border-gray-300 w-full py-4"
        style={{ paddingHorizontal: 4 }}
        entering={FadeInDown.delay(index * 100)}
        exiting={FadeOutDown}
      >
        <View className="flex flex-row items-center justify-center gap-3">
          <Image
            source={{ uri: item?.image }}
            className="size-10 rounded-full border border-gray-300"
          />
          <View>
            <Text className="text-gray-800 text-base font-semibold">
              {item?.symbol?.toUpperCase()}
            </Text>
            <Text className="text-gray-500 text-sm capitalize">
              {item.name}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <View className="flex flex-row justify-center items-center gap-1">
            <Text className="text-gray-800 text-sm font-semibold">
              ${formatNumberWithDots(Number(item.current_price))}
            </Text>
            <Text className="text-gray-500 text-xs">
              ({formatNumberWithDots(item?.lot)} Lot)
            </Text>
          </View>
          <Text className="text-green-600 font-semibold">
            ${formatNumberWithDots(Number(item?.current_price) * item?.lot)}
          </Text>
        </View>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

export default LongPressAsset;
