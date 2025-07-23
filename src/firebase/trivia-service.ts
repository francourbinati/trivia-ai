import { db } from './config';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { Trivia } from '@/types';

export interface TriviaData {
  trivia: Trivia[];
  subject: string;
  difficulty: string;
  createdAt: Date;
}

export async function saveTrivia(triviaData: TriviaData) {
  try {
    const docRef = await addDoc(collection(db, 'trivia'), {
      ...triviaData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving trivia:', error);
    throw error;
  }
}

export async function getTriviaById(id: string) {
  try {
    const docRef = doc(db, 'trivia', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as TriviaData & { id: string };
    }
    return null;
  } catch (error) {
    console.error('Error fetching trivia:', error);
    throw error;
  }
}
