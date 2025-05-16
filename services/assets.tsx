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
  updateDoc,
} from "firebase/firestore";
import moment from "moment";

export const addAsset = async (asset: {
  assetId: string;
  lot: number;
  email: string;
  category: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "assets"), {
      ...asset,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const updateAssetLot = async (assetId: string, newLot: number) => {
  try {
    const docRef = doc(db, "assets", assetId);
    await updateDoc(docRef, { lot: newLot });
    return assetId;
  } catch (error) {
    console.error("Error updating asset lot:", error);
    throw error;
  }
};

export const deleteAsset = async (idAsset: string) => {
  try {
    const docRef = doc(db, "assets", idAsset);
    await deleteDoc(docRef);
    return idAsset;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const getAssetsByEmail = async (email: string) => {
  try {
    const q = query(collection(db, "assets"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const assets: any[] = [];

    querySnapshot.forEach((doc) => {
      assets.push({ id: doc.id, ...doc.data() });
    });

    return assets;
  } catch (error) {
    console.log("Error fetching assets:", error);
    throw error;
  }
};

export const getCashflowLineChartData = async (email: string) => {
  const sixMonthsAgo = moment().subtract(5, "months").startOf("month").toDate();
  const q = query(
    collection(db, "cashflow"),
    where("email", "==", email),
    where("date", ">=", Timestamp.fromDate(sixMonthsAgo))
  );
  const querySnapshot = await getDocs(q);

  const months = [...Array(6)].map((_, i) => {
    const date = moment()
      .subtract(5 - i, "months")
      .startOf("month");
    return {
      label: date.format("MMM YYYY"), // "Jan 2025"
      date: date.format("MM-YYYY"), // "01-2025"
      key: date.format("YYYY-MM"), // for grouping
    };
  });

  const incomeMap: Record<string, number> = {};
  const expenseMap: Record<string, number> = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (!data?.date || !data?.type || !data?.amount) return;

    const entryDate = moment(data.date.toDate?.() ?? data.date);
    const key = entryDate.format("YYYY-MM");

    if (!months.find((m) => m.key === key)) return;

    const mapToUse = data.type === "Income" ? incomeMap : expenseMap;
    mapToUse[key] = (mapToUse[key] || 0) + Number(data.amount);
  });

  const buildChartData = (map: Record<string, number>) =>
    months.map((m) => ({
      label: m.label,
      date: m.date,
      value: map[m.key] || 0,
    }));

  return [
    {
      label: "Income",
      color: "#22c55e",
      data: buildChartData(incomeMap),
    },
    {
      label: "Expense",
      color: "#ef4444",
      data: buildChartData(expenseMap),
    },
  ];
};
