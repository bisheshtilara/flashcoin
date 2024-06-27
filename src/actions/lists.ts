import { db } from "@/firebase";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getCoinByID } from "./charts";
import { IMarket } from "./topMovers";

const usersCollection = "users";
const listsCollection = "lists";

export interface IList {
  id: string;
  name: string;
  coins: IMarket[];
}

export const getListsFromUser = async (userID: string) => {
  if (!userID) return [];
  try {
    const userRef = doc(db, usersCollection, userID);
    const user = await getDoc(userRef);
    if (user.exists()) {
      return user.data()?.lists ? user.data()?.lists : [];
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
  }
};

export const getListByID = async (listID: string) => {
  try {
    const listRef = doc(db, listsCollection, listID);
    const list = await getDoc(listRef);
    if (list.exists()) {
      return { ...list.data(), id: listID } as IList;
    } else {
      throw new Error("List does not exist");
    }
  } catch (e) {
    console.log(e);
  }
};

export const getAllListsByUserID = async (userID: string) => {
  try {
    const IDLists = await getListsFromUser(userID);
    let result: IList[] = [];
    for (const id of IDLists) {
      const list = await getListByID(id);
      if (list) result = [...result, { ...list, id } as IList];
    }
    return result;
  } catch (e) {
    console.log(e);
  }
};

export const createList = async (
  userID: string,
  newList: IList,
  lists: string[]
) => {
  try {
    const newListID = uuidv4();
    await setDoc(doc(db, listsCollection, newListID), newList);
    const docRef = doc(db, usersCollection, userID);
    await updateDoc(docRef, {
      lists: arrayUnion(newListID),
    });
  } catch (e) {
    console.log(e);
  }
};

export const updateList = async (listID: string, newList: IList) => {
  try {
    await setDoc(doc(db, listsCollection, listID), newList);
  } catch (e) {
    console.log(e);
  }
};

export const addCoinToList = async (listID: string, coinID: string) => {
  try {
    const coin = await getCoinByID(coinID);
    const listRef = doc(db, listsCollection, listID);
    await updateDoc(listRef, {
      coins: arrayUnion(coin),
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteList = async (
  userID: string,
  listID: string,
  lists: string[]
) => {
  try {
    await deleteDoc(doc(db, listsCollection, listID));
    const docRef = doc(db, usersCollection, userID);
    await updateDoc(docRef, {
      lists: arrayRemove(listID),
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteCoinFromList = async (listID: string, coin: IMarket) => {
  try {
    const listRef = doc(db, listsCollection, listID);
    const list = await getDoc(listRef);
    if (list.exists()) {
      const newList = {
        ...list.data(),
        coins: list.data()?.coins.filter((c: IMarket) => c.id !== coin.id),
      } as IList;
      await setDoc(doc(db, listsCollection, listID), newList);
    } else {
      throw new Error("List does not exist");
    }
  } catch (e) {
    console.log(e);
  }
};
