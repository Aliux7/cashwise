import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Animated, {
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import calculatePercentage from "../utils/calculatePercentage";
import { useFont } from "@shopify/react-native-skia";
import DonutChart from "../components/DonutChart";
import RenderItem from "../components/RenderItem";
import transactionIcon from "@/assets/icons/profit.png";
import arrowIcon from "@/assets/icons/arrow.png";
import analyticsIcon from "@/assets/icons/analytics.png";
import dropdownIcon from "@/assets/icons/dropdown.png";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import generateRandomNumbers from "../utils/generateRandomNumbers";

interface Data {
  value: number;
  percentage: number;
  color: string;
}

const RADIUS = 120;
const STROKE_WIDTH = 15;
const OUTER_STROKE_WIDTH = 36;
const GAP = 0.035;

const cashflow = () => {
  const [isAnalytics, setIsAnalytics] = useState(false);
  const [n, setN] = useState(2);
  const [colors, setColors] = useState(["#4ade80", "#f87171"]);

  const [data, setData] = useState<Data[]>([]);
  const totalValue = useSharedValue(0);

  const transactions = [
    {
      id: 1,
      title: "Coffee",
      date: "Apr 7, 2025",
      amount: -3.5,
      category: "Food & Drink",
    },
    {
      id: 2,
      title: "Salary",
      date: "Apr 6, 2025",
      amount: 2000,
      category: "Salary",
    },
    {
      id: 3,
      title: "Groceries",
      date: "Apr 6, 2025",
      amount: -45.8,
      category: "Side Job",
    },
    {
      id: 4,
      title: "Electric Bill",
      date: "Apr 5, 2025",
      amount: -60.25,
      category: "Bills",
    },
    {
      id: 5,
      title: "Electric Bill",
      date: "Apr 5, 2025",
      amount: -60.25,
      category: "Health",
    },
    {
      id: 6,
      title: "Electric Bill",
      date: "Apr 5, 2025",
      amount: -60.25,
      category: "Food & Drink",
    },
    {
      id: 7,
      title: "Electric Bill",
      date: "Apr 5, 2025",
      amount: -60.25,
      category: "Food & Drink",
    },
  ];
  const decimals = useSharedValue<number[]>([]);

  const generateData = useCallback(() => {
    const generateNumbers = generateRandomNumbers(n);
    const total = generateNumbers.reduce((acc, curr) => acc + curr, 0);
    const generatePercentages = calculatePercentage(generateNumbers, total);
    const generateDecimals = generatePercentages.map(
      (number) => Number(number.toFixed(0)) / 100
    );

    totalValue.value = withTiming(total, { duration: 1000 });
    decimals.value = [...generateDecimals];

    const arrayOfObjects = generateNumbers.map((value, index) => ({
      value,
      percentage: generatePercentages[index],
      color: colors[index],
    }));

    setData(arrayOfObjects);
  }, [n, colors]);

  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 40);
  const smallFont = useFont(
    require("../../assets/fonts/SpaceMono-Regular.ttf"),
    15
  );

  const toggleAnalytics = () => {
    if (!isAnalytics) {
      setN(9);
      setColors([
        "#fda4af",
        "#f0abfc",
        "#c4b5fd",
        "#a5b4fc",
        "#7dd3fc",
        "#5eead4",
        "#86efac",
        "#fde047",
        "#fcd34d",
      ]);
    } else {
      setN(2);
      setColors(["#4ade80", "#f87171"]);
    }
    setIsAnalytics(!isAnalytics);
  };

  useEffect(() => {
    generateData();
  }, [generateData]);

  if (!font || !smallFont) {
    return <View />;
  }

  return (
    <>
      <View className="flex-1 bg-white">
        <ScrollView>
          <View className="w-full items-center relative">
            <TouchableOpacity
              onPress={toggleAnalytics}
              className="absolute top-6 right-6"
            >
              <Image
                source={!isAnalytics ? analyticsIcon : transactionIcon}
                style={{ tintColor: "#51A2FF", width: 18, height: 18 }}
              />
            </TouchableOpacity>
            <View
              className="mt-5"
              style={{ height: RADIUS * 2 + 10, width: RADIUS * 2 }}
            >
              <DonutChart
                radius={RADIUS}
                gap={GAP}
                strokeWidth={STROKE_WIDTH}
                outerStrokeWidth={OUTER_STROKE_WIDTH}
                font={font}
                smallFont={smallFont}
                totalValue={totalValue}
                n={n}
                decimals={decimals}
                colors={colors}
              />
            </View>
          </View>
          {!isAnalytics && (
            <View className="flex flex-row m-5 gap-4">
              <View className="flex-1 h-20 rounded-md overflow-hidden border border-green-200">
                <LinearGradient
                  colors={["#DBFCE7", "#F0FDF4", "#F0FDF4"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="flex justify-center items-start w-full h-full px-4"
                >
                  <View className="flex flex-row justify-between w-full items-center">
                    <Text className="text-xs text-gray-500 ">Your Income</Text>
                    <Image
                      source={arrowIcon}
                      style={{ tintColor: "#16a34a", width: 12, height: 12 }}
                    />
                  </View>
                  <Text className="text-lg text-green-600 mt-0.5 truncate w-full">
                    Rp. 10.000.000,00
                  </Text>
                </LinearGradient>
              </View>
              <View className="flex-1 h-20 rounded-md overflow-hidden border border-red-200">
                <LinearGradient
                  colors={["#FFE2E2", "#FEF2F2", "#FEF2F2"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="flex justify-center items-start w-full h-full px-4"
                >
                  <View className="flex flex-row justify-between w-full items-center">
                    <Text className="text-xs text-gray-500">Your Expenses</Text>
                    <Image
                      source={arrowIcon}
                      className="rotate-180"
                      style={{
                        tintColor: "#dc2626",
                        width: 12,
                        height: 12,
                        transform: [{ rotate: "180deg" }],
                      }}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-lg text-red-600 mt-0.5 truncate w-full"
                  >
                    Rp. 10.000.000,00
                  </Text>
                </LinearGradient>
              </View>
            </View>
          )}
          <View className="m-5 flex flex-col gap-4">
            <Animated.View
              className="flex flex-row justify-between items-center"
              entering={FadeInDown}
              exiting={FadeOutDown}
            >
              <Text className="text-gray-500 text-xl">
                {isAnalytics ? "Categories" : "Transactions"}
              </Text>
              <View className="flex flex-row justify-center items-center gap-2">
                <Text className="text-gray-800 text-xl">April 2025</Text>
                <Image
                  source={dropdownIcon}
                  style={{ tintColor: "#6b7280", width: 10, height: 10 }}
                />
              </View>
            </Animated.View>
            {!isAnalytics ? (
              <View>
                {transactions.map((item, index) => (
                  <Animated.View
                    key={index}
                    className="flex-row justify-between items-center py-3 border-b border-blue-50"
                    entering={FadeInDown.delay(index * 200)}
                    exiting={FadeOutDown}
                  >
                    <View>
                      <Text className="text-lg text-black">{item.title}</Text>
                      <Text className="text-sm text-gray-400">
                        {item.date} - {item.category}
                      </Text>
                    </View>
                    <Text
                      className={`text-base font-semibold ${
                        item.amount > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.amount > 0
                        ? `+Rp. ${item.amount}`
                        : `-Rp. ${Math.abs(item.amount)}`}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            ) : (
              <View>
                {data.map((item, index) => (
                  <RenderItem item={item} key={index} index={index} />
                ))}
              </View>
            )}
          </View>
          {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="h-20 w-full"
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="flex-row items-center justify-center space-x-2 px-4 gap-5">
            
          </View>
        </ScrollView>  */}
        </ScrollView>
      </View>
    </>
  );
};

export default cashflow;
