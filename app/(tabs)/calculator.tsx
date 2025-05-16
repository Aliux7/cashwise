import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
const MAX_INVESTMENT = 999999999999;

const calculator = () => {
  const { width } = useWindowDimensions();

  const [yearSlider, setYearSlider] = useState(1);
  const [amountSlider, setAmountSlider] = useState(100);
  const [roiSlider, setRoiSlider] = useState(1);

  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [yearlyInvestment, setYearlyInvestment] = useState(0);

  function formatNumberWithDots(amount: number) {
    const capped = amount > MAX_INVESTMENT ? MAX_INVESTMENT : amount;
    return capped.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  useEffect(() => {
    const goalInFuture = amountSlider * 1_000_000;
    const annualROI = roiSlider / 100;
    const monthlyROI = annualROI / 12;

    const totalMonths = yearSlider * 12;
    const totalYears = yearSlider;

    const monthly =
      monthlyROI === 0
        ? goalInFuture / totalMonths
        : goalInFuture *
          (monthlyROI / (Math.pow(1 + monthlyROI, totalMonths) - 1));

    const yearly =
      annualROI === 0
        ? goalInFuture / totalYears
        : goalInFuture *
          (annualROI / (Math.pow(1 + annualROI, totalYears) - 1));

    setMonthlyInvestment(monthly > MAX_INVESTMENT ? MAX_INVESTMENT : monthly);
    setYearlyInvestment(yearly > MAX_INVESTMENT ? MAX_INVESTMENT : yearly);
  }, [yearSlider, amountSlider, roiSlider]);

  return (
    <View className="flex-1 justify-start items-start bg-white py-3 px-5 ">
      <View
        style={{ height: 110 }}
        className="w-full rounded-md overflow-hidden border border-blue-200 mt-1 mb-2"
      >
        <LinearGradient
          colors={["#DBEAFE", "#EFF6FF", "#EFF6FF"]}
          start={[0, 0]}
          end={[1, 1]}
          className="flex flex-col justify-between items-start w-full h-full px-4 py-3"
        >
          <Text className="text-xl font-semibold text-gray-600">
            Required Investments
          </Text>
          <View className="flex flex-row justify-between w-full">
            <View className="flex flex-col justify-start items-start">
              <Text className="text-lg text-gray-500">Montly</Text>
              <Text className="text-xl font-semibold text-blue-500">
                Rp. {formatNumberWithDots(monthlyInvestment)}
              </Text>
            </View>
            <View className="flex flex-col justify-start items-end">
              <Text className="text-lg text-gray-500">Yearly</Text>
              <Text className="text-xl font-semibold text-blue-500">
                Rp. {formatNumberWithDots(yearlyInvestment)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <View className="flex flex-col justify-center items-start">
        <View className="border-b py-5 border-gray-300">
          <Text className="text-lg ">Number of years to achieve the goal</Text>
          <Text className="text-2xl text-gray-700 font-semibold">
            {yearSlider} Years
          </Text>
          <Slider
            style={{ width: width - 35, height: 40 }}
            onValueChange={(val) => setYearSlider(val)}
            minimumValue={1}
            maximumValue={30}
            step={1}
            minimumTrackTintColor="#2B7FFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#2B7FFF"
          />
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm">1 Years</Text>
            <Text className="text-sm">30 Years</Text>
          </View>
        </View>
        <View className="border-b py-5 border-gray-300">
          <Text className="text-lg text-gray-700">
            Estimated amount of the goal
          </Text>
          <Text className="text-2xl text-gray-700 font-semibold">
            Rp. {formatNumberWithDots(amountSlider)}.000.000
          </Text>
          <Slider
            style={{ width: width - 35, height: 40 }}
            onValueChange={(val) => setAmountSlider(val)}
            minimumValue={100}
            maximumValue={20000}
            step={100}
            minimumTrackTintColor="#2B7FFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#2B7FFF"
          />
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm">Rp. 100.000.000</Text>
            <Text className="text-sm">Rp 20.000.000.000</Text>
          </View> 
        </View>
        <View className="border-b py-5 border-gray-300 text-gray-700">
          <Text className="text-lg">
            Target return on investment per year %
          </Text>
          <Text className="text-2xl text-gray-700 font-semibold">
            {roiSlider.toString().slice(0, 4)} %
          </Text>
          <Slider
            style={{ width: width - 35, height: 40 }}
            onValueChange={(val) => setRoiSlider(val)}
            minimumValue={0}
            maximumValue={100}
            step={0.5}
            minimumTrackTintColor="#2B7FFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#2B7FFF"
          />
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm">0%</Text>
            <Text className="text-sm">100%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default calculator;

const styles = StyleSheet.create({});
