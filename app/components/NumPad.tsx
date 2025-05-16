import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { addTransaction } from "@/services/cashflow";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { useTransactionStore } from "@/store/useTransactionStore";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", "000"],
];

const transactionTypeData = [
  { label: "Income", value: "Income" },
  { label: "Expense", value: "Expense" },
];

const categoryData = [
  { label: "Salary", value: "Salary" },
  { label: "Side Job", value: "Side Job" },
  { label: "Food & Drink", value: "Food & Drink" },
  { label: "Groceries", value: "Groceries" },
  { label: "Bills", value: "Bills" },
  { label: "Health & Fitness", value: "Health & Fitness" },
  { label: "Utilities", value: "Utilities" },
  { label: "Transportation", value: "Transportation" },
  { label: "Shopping", value: "Shopping" },
  { label: "Donation", value: "Donation" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Subscriptions", value: "Subscriptions" },
];

export default function NumPad({
  onClose,
  email,
}: {
  onClose: () => void;
  email: string;
}) {
  const { fetchTransactions } = useTransactionStore();
  const amountInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  const [amount, setAmount] = useState("0");
  const [title, setTitle] = useState("");
  const [valueTransaction, setValueTransaction] = useState("Expense");
  const [valueCategory, setValueCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const handleKeyPress = (key: string) => { 
    Haptics.selectionAsync();
    setAmount((prev) => {
      if (prev.length >= 12) return prev;
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

  const formatDate = (date: Date) => {
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

  const onChange = ({ type }: any, selectedDate: any) => {
    if (type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  const handleSubmitTransaction = async () => {
    if (!title.trim()) { 
      setTitleError(true);
      return;
    }
    setTitleError(false);
    
    if (!valueCategory) { 
      setCategoryError(true);
      return;
    }
    setCategoryError(false);
     
    if (amount.trim() === "0") return;
    if (email.trim() === "") return;
     
    try {
      const transaction = {
        title,
        amount: parseInt(amount),
        type: valueTransaction,
        category: valueCategory,
        date,
        email: email,
      };
      await addTransaction(transaction);
      setAmount("0");
      setTitle("");
      setValueCategory(null);
      setTitleError(false);
      setCategoryError(false);
      setValueTransaction("Expense");
      fetchTransactions(email, new Date().getFullYear(), new Date().getMonth());
      onClose?.();
    } catch (error) {
      console.log("Failed to add transaction.");
    }
  };

  return (
    <View className="bg-white w-full rounded-t-3xl p-5">
      <View className="flex-row justify-between gap-5 w-full mb-4">
        <Dropdown
          data={transactionTypeData}
          labelField="label"
          valueField="value"
          value={valueTransaction}
          onFocus={() => {
            setIsTitleFocused(false);
            Keyboard.dismiss();
            titleInputRef.current?.blur();
            amountInputRef.current?.focus();
          }}
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
          onFocus={() => {
            setIsTitleFocused(false);
            Keyboard.dismiss();
            titleInputRef.current?.blur();
            amountInputRef.current?.focus();
          }}
          onChange={(item) => setValueCategory(item.value)}
          placeholder="Category"
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: "#f3e8ff",
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderColor: categoryError ? "#ef4444" : "#d1d5db",
            borderWidth: categoryError ? 1 : 0,
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

      <Text className="text-center text-gray-500 text-base my-3">
        {formatDate(date)}
      </Text>

      <TextInput
        onPress={() => {
          Keyboard.dismiss();
          titleInputRef.current?.blur();
          amountInputRef.current?.focus();
        }}
        ref={amountInputRef}
        value={`Rp. ${formatToRupiah(amount)}`}
        editable={true}
        showSoftInputOnFocus={false}
        caretHidden={false}
        onChangeText={() => {}}
        selection={{
          start: `Rp. ${formatToRupiah(amount)}`.length,
          end: `Rp. ${formatToRupiah(amount)}`.length,
        }}
        className="text-center text-4xl font-bold mb-2 text-gray-700"
      />

      <TextInput
        ref={titleInputRef}
        placeholder="Add Title"
        value={title}
        onChangeText={setTitle}
        onFocus={() => setIsTitleFocused(true)}
        onBlur={() => setIsTitleFocused(false)}
        style={{
          borderBottomColor: titleError ? "#ef4444" : "#d1d5db",
        }}
        className={`text-center text-lg text-gray-600 mb-4 border-b ${
          titleError ? "border-b-red-500" : "border-b-gray-300"
        }`}
      />
      {!isTitleFocused && (
        <View className="flex flex-row justify-between items-center w-full p-0 m-0">
          <View className="flex-row flex-wrap justify-start items-center w-[75%]">
            {KEYS.flat().map((key, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleKeyPress(key)}
                className={`${
                  key === "000" ? "w-[62%]" : "w-24"
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
              onPress={() => setShowPicker(true)}
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
      )}
      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          themeVariant="light"
        />
      )}
    </View>
  );
}
