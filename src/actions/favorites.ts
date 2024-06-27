import { db } from "@/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const usersCollection = "users";

export const addToFavorites = async (userID: string, coinID: string) => {
  try {
    const docRef = doc(db, usersCollection, userID);
    await updateDoc(docRef, {
      favorites: arrayUnion(coinID),
    });
  } catch (e) {
    console.log(e);
  }
};

export const removeFromFavorites = async (userID: string, coinID: string) => {
  try {
    const docRef = doc(db, usersCollection, userID);
    await updateDoc(docRef, {
      favorites: arrayRemove(coinID),
    });
  } catch (e) {
    console.log(e);
  }
};
