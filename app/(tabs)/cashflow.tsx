import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  FadeInDown,
  FadeOutDown,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import DonutChart from "../components/DonutChartComponents/DonutChart";
import RenderItem from "../components/RenderItem";
import transactionIcon from "@/assets/icons/profit.png";
import arrowIcon from "@/assets/icons/arrow.png";
import analyticsIcon from "@/assets/icons/analytics.png";
import dropdownIcon from "@/assets/icons/dropdown.png";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { deleteTransaction } from "@/services/cashflow";
import { Timestamp } from "firebase/firestore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Picker } from "@react-native-picker/picker";
import LongPressTransaction from "../components/LongPressTransaction";
import Modal from "react-native-modal";
import { useAuthStore } from "@/store/useAuthStore";

interface Data {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const RADIUS = 120;
const STROKE_WIDTH = 15;
const OUTER_STROKE_WIDTH = 36;
const GAP = 0.035;

const cashflow = () => {
  const user = useAuthStore((state) => state.user);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );

  const handleLongPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsModalDeleteVisible(true);
  };

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalFilterVisible, setIsModalFilterVisible] = useState(false);
  const [isAnalytics, setIsAnalytics] = useState(false);
  const [n, setN] = useState(2);
  const [colors, setColors] = useState(["#4ade80", "#f87171"]);
  const [data, setData] = useState<Data[]>([]);
  const totalValue = useSharedValue(0);
  const {
    totalIncome,
    totalExpense,
    transactions,
    categories,
    fetchTransactions,
  } = useTransactionStore();
  const decimals = useSharedValue<number[]>([]);
  const spendingPercentage =
    totalIncome + totalExpense === 0
      ? 0
      : Math.min(
          (totalExpense / (totalIncome >= 1 ? totalIncome : 1)) * 100,
          999
        );

  const isAnalyticsShared = useSharedValue(isAnalytics);
  const categoryPercentages = useSharedValue<number[]>([]);
  const centerText = useDerivedValue(() => {
    if (isAnalyticsShared.value && categoryPercentages.value.length > 0) {
      const highest = Math.max(...categoryPercentages.value);
      return `${highest}%`;
    } else {
      return `${Math.round(spendingPercentage)}%`;
    }
  });
  const centerLabel = useDerivedValue(() => {
    if (n === 2) return "Spent Ratio";
    if (data.length === 0) return "";

    const topCategory = data.reduce((a, b) =>
      a.percentage > b.percentage ? a : b
    );

    return topCategory.name;
  });

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(user?.email || "", selectedYear, selectedMonth);
    }, [selectedMonth, selectedYear])
  );
  useEffect(() => {
    isAnalyticsShared.value = isAnalytics;
  }, [isAnalytics]);

  useEffect(() => {
    if (isAnalytics) {
      categoryPercentages.value = data.map((item) => item.percentage);
    }
  }, [data, isAnalytics]);

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

  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 50);
  const smallFont = useFont(
    require("../../assets/fonts/SpaceMono-Regular.ttf"),
    16
  );

  const toggleAnalytics = () => {
    if (!isAnalytics) {
      setN(12);
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
        "#fdba74",
        "#fb7185",
        "#bbf7d0",
      ]);
    } else {
      setN(2);
      setColors(["#4ade80", "#f87171"]);
    }
    setIsAnalytics(!isAnalytics);
  };

  useEffect(() => {
    if (!isAnalytics) {
      const total = totalIncome + totalExpense;
      const safeTotal = total === 0 ? 1 : total;
      const incomeDecimal = totalIncome / safeTotal;
      const expenseDecimal = totalExpense / safeTotal;

      decimals.value = [incomeDecimal, expenseDecimal];
      totalValue.value = withTiming(total, { duration: 1000 });
    } else if (isAnalytics && categories) {
      const entries = Object.entries(categories) as [string, number][];
      const total = entries.reduce((sum, [, val]) => sum + val, 0);
      const safeTotal = total === 0 ? 1 : total;

      const newData: Data[] = entries
        .map(([name, value]) => ({
          name,
          value,
          percentage: Math.round((value / safeTotal) * 100),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .map((item, index) => ({
          ...item,
          color: colors[index % colors.length],
        }));

      setData(newData);
      decimals.value = newData.map((item) => item.value / safeTotal);
      totalValue.value = withTiming(total, { duration: 1000 });
    }
  }, [totalIncome, totalExpense, isAnalytics, categories]);

  const handleDeleteTransaction = async (idTransaction: string) => {
    const result = await deleteTransaction(idTransaction);
    fetchTransactions(user?.email || "", selectedYear, selectedMonth);
    setIsModalDeleteVisible(false);
  };

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
                centerText={centerText}
                centerLabel={centerLabel}
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
                    Rp. {formatToRupiah(String(totalIncome))}
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
                    Rp. {formatToRupiah(String(totalExpense))}
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
              <TouchableOpacity
                onPress={() => setIsModalFilterVisible(true)}
                className="flex flex-row justify-center items-center gap-2"
              >
                <Text className="text-gray-800 text-xl">
                  {new Date(selectedYear, selectedMonth).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </Text>
                <Image
                  source={dropdownIcon}
                  style={{ tintColor: "#6b7280", width: 10, height: 10 }}
                />
              </TouchableOpacity>
            </Animated.View>
            {!isAnalytics ? (
              <View>
                {transactions?.map((item, index) => (
                  <LongPressTransaction
                    key={index}
                    item={item}
                    index={index}
                    onLongPress={handleLongPress}
                  />
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
        </ScrollView>
        <Modal
          isVisible={isModalFilterVisible}
          onBackdropPress={() => setIsModalFilterVisible(false)}
          onBackButtonPress={() => setIsModalFilterVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View className="bg-white rounded-xl p-4 py-6 w-full shadow-xl mt-40 ">
            <View className="border-b border-blue-300 rounded-md">
              <Picker
                selectedValue={selectedMonth + 1}
                onValueChange={(itemValue) => setSelectedMonth(itemValue - 1)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item
                    key={i + 1}
                    label={new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                    value={i + 1}
                  />
                ))}
              </Picker>
            </View>
            <View className="border-b border-blue-300 rounded-md">
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 5 + i;
                  return (
                    <Picker.Item key={year} label={String(year)} value={year} />
                  );
                })}
              </Picker>
            </View>
            <TouchableOpacity
              onPress={() => setIsModalFilterVisible(false)}
              className="mt-6 bg-white p-2 py-3 text-lg rounded-md"
            >
              <Text className="text-blue-500 text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {selectedTransaction && (
          <Modal
            isVisible={isModalDeleteVisible}
            onBackdropPress={() => setIsModalDeleteVisible(false)}
            onBackButtonPress={() => setIsModalDeleteVisible(false)}
            style={{ justifyContent: "flex-end", margin: 0 }}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown"
          >
            <View className="flex flex-row justify-between items-center w-full rounded-2xl p-6 bg-white">
              <View>
                <Text className="text-xl font-bold">
                  {selectedTransaction?.title}
                </Text>
                <Text className="text-lg">{selectedTransaction?.category}</Text>
                <Text className="text-sm">
                  {formatDate(selectedTransaction?.date)}
                </Text>
                <Text
                  className={`text-base font-semibold ${
                    selectedTransaction?.type === "Income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedTransaction?.type === "Income" ? "+" : "-"}Rp.{" "}
                  {formatToRupiah(String(selectedTransaction?.amount))}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteTransaction(selectedTransaction.id);
                  }}
                >
                  <Text className="text-red-500 text-lg">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
};
export default cashflow;
