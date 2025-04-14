import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { addTransaction } from "@/services/cashflow";
// import DatePicker from 'react-native-date-picker'

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", "000"],
];

const transactionTypeData = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const categoryData = [
  { label: "Salary", value: "salary" },
  { label: "Side Job", value: "side job" },
  { label: "Food & Drink", value: "food & drink" },
  { label: "Groceries", value: "groceries" },
  { label: "Bills", value: "bills" },
  { label: "Health & Fitness", value: "health & fitness" },
  { label: "Utilities", value: "utilities" },
  { label: "Transportation", value: "transportation" },
  { label: "Shopping", value: "shopping" },
  { label: "Bonus", value: "bonus" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Subscriptions", value: "subscriptions" },
];

export default function NumPad({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("0");
  const [title, setTitle] = useState("");
  const [valueTransaction, setValueTransaction] = useState("expense");
  const [valueCategory, setValueCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleKeyPress = (key: string) => {
    setAmount((prev) => {
      if (prev === "0") {
        if (key === "0" || key === "000") {
          return prev;
        }
        return key;
      }

      return prev + key;
    });
  };

  const handleBackspace = () => {
    setAmount((prev) => {
      const newAmount = prev.slice(0, -1);
      return newAmount.length === 0 ? "0" : newAmount;
    });
  };

  const formatToRupiah = (value: string) => {
    const numberOnly = value.replace(/\D/g, "");
    return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmitTransaction = async () => {
    try {
      const transaction = {
        amount,
        title,
        type: valueTransaction,
        category: valueCategory,
      };
      await addTransaction(transaction);
      setAmount("0");
      setTitle("");
      setValueCategory(null);
      onClose?.();
    } catch (error) {
      console.log("Failed to add transaction.");
    }
  };

  return (
    <View className="bg-white w-full rounded-3xl max-w-md">
      <View className="flex-row justify-between gap-5 w-full mb-4">
        <Dropdown
          data={transactionTypeData}
          labelField="label"
          valueField="value"
          value={valueTransaction}
          onChange={(item) => setValueTransaction(item.value)}
          placeholder="Transaction Type"
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: "#fef9c3",
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
          containerStyle={{
            borderRadius: 12,
            backgroundColor: "#fef9c3",
          }}
          placeholderStyle={{
            color: "#a16207",
            fontWeight: "600",
          }}
          selectedTextStyle={{
            color: "#a16207",
            fontWeight: "bold",
          }}
          itemTextStyle={{
            color: "#a16207",
          }}
        />
        <Dropdown
          data={categoryData}
          labelField="label"
          valueField="value"
          value={valueCategory}
          onChange={(item) => setValueCategory(item.value)}
          placeholder="Category"
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: "#f3e8ff",
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
          containerStyle={{
            borderRadius: 12,
            backgroundColor: "#f3e8ff",
            maxHeight: 200,
          }}
          placeholderStyle={{
            color: "#a21caf",
            fontWeight: "600",
          }}
          selectedTextStyle={{
            color: "#a21caf",
            fontWeight: "bold",
          }}
          itemTextStyle={{
            color: "#a21caf",
          }}
        />
      </View>

      <Text className="text-center text-gray-500 text-sm mb-1 mt-3">Today</Text>
      <Text className="text-center text-4xl font-bold mb-4">
        Rp. {formatToRupiah(amount)}
      </Text>

      <TextInput
        placeholder="Add Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomColor: "#d1d5db" }}
        className="text-center text-base text-gray-600 mb-4 border-b border-b-gray-300"
      />

      <View className="flex flex-row justify-center items-center">
        <View className="flex-row flex-wrap justify-center items-center w-[80%]">
          {KEYS.flat().map((key, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleKeyPress(key)}
              className={`${
                key === "000" ? "w-[59%]" : "w-24"
              } h-24  m-[1.5%] bg-gray-100 rounded-2xl justify-center items-center`}
            >
              <Text className="text-xl font-medium">{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex flex-col justify-center items-center w-[25%]">
          <TouchableOpacity
            onPress={handleBackspace}
            className="w-[95%] aspect-square m-[5%] bg-rose-100 rounded-2xl justify-center items-center"
          >
            <Ionicons name="backspace-outline" size={24} color="#A14F4F" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpen(true)}
            className="w-[95%] aspect-square m-[5%] bg-blue-100 rounded-2xl justify-center items-center"
          >
            <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmitTransaction}
            className="w-[95%] flex-1 m-[5%] bg-green-100 rounded-2xl justify-center items-center"
          >
            <Ionicons name="checkmark" size={34} color="#22c55e" />
          </TouchableOpacity>
        </View>
      </View>
      {/* <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      /> */}
    </View>
  );
}
