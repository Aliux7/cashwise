import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const addTransaction = async (transaction: {
  amount: string;
  title: string;
  type: string;
  category: string | null;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'cashflow'), {
      ...transaction,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};
