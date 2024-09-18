import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const firebaseAppInitialized = initializeApp({
    apiKey: "AIzaSyBzpaZliqae-O0pwB9nwlyK1ZBmN7AENLg",
    authDomain: "trello-clone-app-841d7.firebaseapp.com",
    projectId: "trello-clone-app-841d7",
    storageBucket: "trello-clone-app-841d7.appspot.com",
    messagingSenderId: "838009322179",
    appId: "1:838009322179:web:be85f6202e67cf607e8076",
  });

  const db = getFirestore(firebaseAppInitialized);

  return {
    provide: {
      db,
      firebaseAppInitialized,
    },
  };
});
