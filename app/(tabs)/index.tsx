import { Link, useFocusEffect } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import profileIcon from "@/assets/icons/user.png";
import arrowIcon from "@/assets/icons/arrow.png";
import { LinearGradient } from "expo-linear-gradient";
import { lineChartData } from "../data/data";
import { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import AnimatedText from "../components/LineChartComponents/AnimatedText";
import { useFont } from "@shopify/react-native-skia";
import { useAuthStore } from "@/store/useAuthStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { Timestamp } from "firebase/firestore";
import { usePortfolioStore } from "@/store/usePortofolioStore";
import investmentIcon from "@/assets/icons/invest.png";
import { getCashflowLineChartData } from "@/services/assets";
import LineChart, {
  MultiDataSet,
} from "../components/LineChartComponents/LineChart";

export default function Index() {
  const CHART_MARGIN = 0;
  const CHART_HEIGHT = 200;
  const { width: CHART_WIDTH } = useWindowDimensions();
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState<string>("Total");
  const { totalValue, fetchAssets } = usePortfolioStore();
  const selectedIncome = useSharedValue(0);
  const selectedExpenses = useSharedValue(0);
  const selectedLabel = useSharedValue("");
  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 15);
  const { totalIncome, totalExpense, transactions, fetchTransactions } =
    useTransactionStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [lineChartData, setLineChartData] = useState<MultiDataSet[]>([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useFocusEffect(
    useCallback(() => {
      if (user?.email) {
        fetchTransactions(user?.email || "", selectedYear, selectedMonth);
        getCashflowLineChartData(user?.email).then((result) => {
          console.log(JSON.stringify(result, null, 2));
          setLineChartData(result);
        });
      }
    }, [selectedMonth, selectedYear, user?.email])
  );

  useEffect(() => {
    if (user?.email) {
      fetchAssets(user.email);
    }
  }, [user?.email]);

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

  const formatNumberWithDots = (amount: number) => {
    return amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  if (!font) {
    return null;
  }

  return (
    <>
      <View className="flex-1 justify-center items-center bg-white">
        {/* Header */}
        <View className="flex flex-row px-5 py-3 justify-between items-end w-full">
          <View className="flex flex-col justify-start items-start">
            <Text className="text-gray-500 text-xs">Welcome Back! 👋</Text>
            <Text className="capitalize">{user?.name}</Text>
          </View>
          <Link
            href="/profile"
            className="border rounded-full p-1 border-blue-400"
          >
            <Image
              source={profileIcon}
              style={{ tintColor: "#51A2FF" }}
              className="size-5"
            />
          </Link>
        </View>

        <ScrollView
          className="w-full flex-1"
          stickyHeaderIndices={[0, 1]}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <View className="flex flex-col w-full">
            <View className="flex flex-col justify-between items-start mx-5 border-l border-b border-blue-200 rounded-md">
              <AnimatedText
                selectedIncome={selectedIncome}
                selectedExpenses={selectedExpenses}
                selectedLabel={selectedLabel}
                font={font}
              />
              <LineChart
                datasets={lineChartData}
                chartHeight={CHART_HEIGHT}
                chartWidth={CHART_WIDTH - 37}
                chartMargin={CHART_MARGIN}
                setSelectedDate={setSelectedDate}
                selectedIncome={selectedIncome}
                selectedExpenses={selectedExpenses}
                selectedLabel={selectedLabel}
              />
            </View>
            <View className="m-5 h-20 shadow-xl rounded-md overflow-hidden border border-blue-200">
              <LinearGradient
                colors={["#DBEAFE", "#EFF6FF", "#EFF6FF"]}
                start={[0, 0]}
                end={[1, 1]}
                className="flex flex-row justify-between items-center w-full h-full px-4"
              >
                <View>
                  <Text className="text-sm text-gray-500">
                    Your Total Investment Assets
                  </Text>
                  <Text className="text-2xl text-blue-600 mt-0.5">
                    $ {formatNumberWithDots(totalValue)}
                  </Text>
                </View>
                <Image
                  source={investmentIcon}
                  style={{ tintColor: "#51A2FF" }}
                  className="size-8 self-center"
                />
              </LinearGradient>
            </View>
            <View className="flex flex-row mx-5 gap-4">
              <View className="flex-1 h-20 shadow-xl rounded-md overflow-hidden border border-green-200">
                <LinearGradient
                  colors={["#DBFCE7", "#F0FDF4", "#F0FDF4"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="flex justify-center items-start w-full h-full px-4"
                >
                  <View className="flex flex-row justify-between w-full items-center">
                    <Text className="text-xs text-gray-500 ">
                      Your Income ({monthNames[selectedMonth]})
                    </Text>
                    <Image
                      source={arrowIcon}
                      style={{ tintColor: "#16a34a", width: 12, height: 12 }}
                    />
                  </View>
                  <Text className="text-lg text-green-600 mt-0.5 truncate w-full">
                    Rp. {formatToRupiah(totalIncome.toString())}
                  </Text>
                </LinearGradient>
              </View>
              <View className="flex-1 h-20 shadow-xl rounded-md overflow-hidden border border-red-200">
                <LinearGradient
                  colors={["#FFE2E2", "#FEF2F2", "#FEF2F2"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="flex justify-center items-start w-full h-full px-4"
                >
                  <View className="flex flex-row justify-between w-full items-center">
                    <Text className="text-xs text-gray-500">
                      Your Expenses ({monthNames[selectedMonth]})
                    </Text>
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
                    Rp. {formatToRupiah(totalExpense.toString())}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          <View className="p-5 bg-white shadow-xl mt-5 rounded-t-3xl border-t border-x border-blue-100 min-h-64">
            <Text className="text-gray-500 text-xl">Recent Transactions</Text>
            {transactions.slice(0, 7).map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center py-3 border-b border-blue-50"
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
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
