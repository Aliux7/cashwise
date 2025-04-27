import { create } from "zustand";
import { getTransactionsByEmailAndDate } from "@/services/cashflow";

interface TransactionStore {
  transactions: any[];
  totalIncome: number;
  totalExpense: number;
  categories: Record<string, number>;
  fetchTransactions: (year: number, month: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  totalIncome: 0,
  totalExpense: 0,
  categories: {},
  fetchTransactions: async (year: number, month: number) => {
    try {
      const email = "kelsonsusilo@gmail.com";
      const fetched = await getTransactionsByEmailAndDate(email, year, month);

      set({
        transactions: fetched?.transactions || [],
        totalIncome: fetched?.totalIncome || 0,
        totalExpense: fetched?.totalExpense || 0,
        categories: fetched?.categories || {},
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      set({
        transactions: [],
        totalIncome: 0,
        totalExpense: 0,
        categories: {},
      });
    }
  },
}));
