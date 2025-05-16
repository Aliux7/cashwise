import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const addTransaction = async (transaction: {
  title: string;
  amount: number;
  type: string;
  category: string | null;
  date: Date;
  email: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "cashflow"), {
      ...transaction,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (idTransaction: string) => {
  try {
    const docRef = doc(db, "cashflow", idTransaction);
    await deleteDoc(docRef);
    return idTransaction;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const getTransactionsByEmailAndDate = async (
  email: string,
  year: number,
  month: number
) => {
  try {
    let totalIncome = 0;
    let totalExpense = 0;
    const categories: Record<string, number> = {};

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const q = query(
      collection(db, "cashflow"),
      where("email", "==", email),
      where("date", ">=", Timestamp.fromDate(start)),
      where("date", "<", Timestamp.fromDate(end)),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.type === "Income") {
        totalIncome += data.amount;
      } else if (data.type === "Expense") {
        totalExpense += data.amount;

        const category = data.category || "Uncategorized";
        categories[category] = (categories[category] || 0) + data.amount;
      }

      return {
        id: doc.id,
        ...data,
      };
    });

    return {
      transactions,
      totalIncome,
      totalExpense,
      categories,
    };
  } catch (error) {
    console.log("Error fetching transactions:", error);
  }
};
