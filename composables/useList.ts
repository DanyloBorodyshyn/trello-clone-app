import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import type { ListInterface } from "~/types/list";

export const useList = async (id: string) => {
  const listId = ref("");
  const cardDraggedId = ref("");
  const currentCard = ref({
    listId: "",
    id: "",
    title: "",
    description: "",
    performers: [],
    mainUser: {
      value: '',
      label: ''
    },
    priority: "false",
    dateCreated: Date.now(),
  });
  const list:ListInterface = reactive({
    title: "",
    id: "",
    cards: [],
    dateCreated: Date.now(),
  });
  const card = reactive({
    title: "",
    id: "",
    performers: [],
    mainUser: {
      value: '',
      label: ''
    },
    priority: "false",
    dateCreated: Date.now(),
    listId: "",
  });
  const { $db } = useNuxtApp();
  const { uid } = await getCurrentUser();
  const boardRef = doc($db, "users", uid, "boards", id);
  const boardSnap = await getDoc(boardRef);

  let boardData = ref({}) as any;
  if (boardSnap.exists()) {
    boardData.value = boardSnap.data();
    boardData.value.id = id;
  }
  const createList = async () => {
    if (list.title != "") {
      list.id = uuidv4();
      list.cards = [];
      list.dateCreated = Date.now();
      const copiedListData = JSON.parse(JSON.stringify(list));
      if (boardData.value.lists) {
        boardData.value.lists.push(copiedListData);
      } else {
        boardData.value.lists = [];
        boardData.value.lists.push(copiedListData);
      }
      await updateBoard();
      list.title = "";
      list.id = "";
      list.cards = [];
      list.dateCreated = Date.now();
    }
  };

  const updateCardList = async (newlistId: number | string, cardParam?: any) => {
    let tempListIndex = -1;
    let tempCardIndex = -1;
    let newListIndex = -1;
    let tempListCount = 0;
    let tempCardCount = 0;
    if(cardParam) currentCard.value = cardParam
    //get the index in current cards current list
    console.log(boardData.value.lists);
    
    for (const list of boardData.value.lists) {
      if (list.id === newlistId) {
        newListIndex = tempListCount;
      }
      if (currentCard.value.listId === list.id) {        
        //correct list, now find card
        tempListIndex = tempListCount;
        for (const card of list.cards) {
          if (card.id === currentCard.value.id) {
            tempCardIndex = tempCardCount;
          }
          tempCardCount++;
        }
      }
      tempListCount++;
    }

    //remove currentCard from current list
      boardData.value.lists[tempListIndex]?.cards?.splice(tempCardIndex, 1);
    
    //add currentCard to its new list
    currentCard.value.listId = newlistId as string;
    boardData.value.lists[newListIndex]?.cards?.push(currentCard.value);

    await updateBoard();
  };

  const allowDrop = (ev: Event) => {
    ev.preventDefault();
  };

  const drag = (ev: Event | null, card: any) => {
    currentCard.value = card;
  };

  const drop = (ev: Event, listId: any) => {
    ev.preventDefault();
    updateCardList(listId);
  };

  const deleteList = async (listId: number) => {
    let index = -1;
    let count = 0;
    for (const list of boardData.value.lists) {
      if (list.id == listId) {
        index = count;
      }
      count++;
    }
    if (index > -1) {
      boardData.value.lists.splice(index, 1);
      await updateBoard();
    }
  };

  const createCard = async () => {
    //show modal to capture card name
    //add card
    if (card.title != "") {
      //add to firebase
      //Let's give our card a created date.
      card.id = uuidv4();
      card.dateCreated = Date.now();
      card.listId = listId.value;
      card.performers = []
      card.mainUser = {
        value: '',
        label: ''
      }
      if (boardData.value.lists) {
        let index = -1;
        let count = 0;
        for (const list of boardData.value.lists) {
          if (list.id == listId.value) {
            index = count;
          }
          count++;
        }
        
        if (index != -1) {
          const parsedCard = JSON.parse(JSON.stringify(card))
          //we found the list, now push our card
          if (boardData.value.lists[index].cards) {
            boardData.value.lists[index].cards.push(parsedCard);
          } else {
            boardData.value.lists[index].cards = [];
            boardData.value.lists[index].cards.push(parsedCard);
          }
        }
      }
      await updateBoard();
      card.title = "";
      listId.value = "";
    }
  };

  const editCard = (card: any) => {
    currentCard.value = card;
  };

  const updateCard = async () => {
    for (const list of boardData.value.lists) {
      if (currentCard.value.listId === list.id) {
        //correct list, now find card
        for (const card of list.cards) {
          if (card.id === currentCard.value.id) {
            card.title = currentCard.value.title;
            card.id = currentCard.value.id;
            card.description = currentCard.value?.description ?? '';
            card.priority = currentCard.value?.priority ?? 'false';
            card.dateCreated = currentCard.value.dateCreated;
            card.performers = currentCard.value.performers;
            card.mainUser = currentCard.value.mainUser;
            card.listId = currentCard.value.listId;
          }
        }
      }
    }
    
    console.log(boardData.value.lists);
    await updateBoard();
  };

  const deleteCard = () => {
    let i = 0;
    let j = 0;
    let index = {
      list: -1,
      card: -1,
    };
    for (const list of boardData.value.lists) {
      if (currentCard.value.listId === list.id) {
        //correct list, now find card
        for (const card of list.cards) {
          if (card.id === currentCard.value.id) {
            index.list = i;
            index.card = j;
          }
          j++;
        }
      }
      i++;
    }
    if (index.list > -1) {
      boardData.value.lists[index.list].cards.splice(index.card, 1);
      updateBoard();
    }
  };

  const deleteBoard = async () => {
    try {
      const boardRef = doc($db, "users", uid, "boards", id);
      await deleteDoc(boardRef);
    } catch (error) {}
  };

  const updateBoard = async () => {
    const updateRef = doc($db, "users", uid, "boards", id);
    const copiedData = JSON.parse(JSON.stringify(boardData.value))
    await updateDoc(updateRef, copiedData);
  };

  return {
    createList,
    updateCardList,
    drag,
    drop,
    card,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    deleteBoard,
    updateBoard,
    currentCard,
    editCard,
    boardData,
    list,
    listId,
    allowDrop,
  };
};
