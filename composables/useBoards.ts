import { collection, deleteDoc, doc, query, setDoc, updateDoc } from "firebase/firestore";
import {ref as fireRef, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import {useFirebaseStorage} from 'vuefire'
import { v4 as uuidv4 } from "uuid";
import { toast } from "~/components/shadcn-ui/toast/use-toast";

export const useBoards = async () => {
  const board = reactive({
    title: "",
    dateCreated: Date.now(),
    image: {
      name: "",
      originalName: "",
      downloadURL: "",
      uuid: "",
    },
  });
  const defaultListData = [
    {
      title: 'TODO',
      id: uuidv4(),
      cards: [],
      dateCreated: Date.now()
    },
    {
      title: 'In progress',
      id: uuidv4(),
      cards: [],
      dateCreated: Date.now()
    },
    {
      title: 'Done',
      id: uuidv4(),
      cards: [],
      dateCreated: Date.now()
    },
  ]
  const currentImageId = ref("");
  const fileToUpload = ref({} as any);

  const { $db } = useNuxtApp();
  const { uid } = await getCurrentUser();
  const todosRef = collection($db, "users", uid, "boards");
  const q = query(todosRef);
  const boards = useCollection(q);
  const addBoard = () => {
    currentImageId.value = uuidv4();
  };
  const createList = async (id: string) => {
    const updateRef = doc($db, "users", uid, "boards", id);
    await updateDoc(updateRef, {
      lists: defaultListData
    });
  };
  const createBoard = async () => {
    //Створення дошки.
    board.dateCreated = Date.now();
    const boardsRef = doc(
      collection($db, "users", uid, "boards"),
      currentImageId.value
    );
    await setDoc(boardsRef, board);
    toast({
      title: 'Board',
      description: 'You have successfully created a new board.',
    });
    createList(boardsRef.id)
  };

  const deleteBoard = async (boardId:string) => {
    const boardRef = doc($db, "users", uid, "boards", boardId);
    await deleteDoc(boardRef);
    
    toast({
      title: 'Board',
      description: 'The board has been successfully deleted.',
    });
  };
  
  const uploadFiles = () => {
    const storage = useFirebaseStorage();
    const itemFilename =
      fileToUpload.value.uuid + '-' + fileToUpload.value.file.name
      const itemName = `images/${uid}/boards/${currentImageId.value}/${itemFilename}`;

    const itemRef = fireRef(storage,itemName)
    const itemMeta = {
      customMetadata: {
        owner: uid,
      },
    }
    const task = uploadBytesResumable(itemRef,fileToUpload.value.file, itemMeta)

    // Відстеження оновлень
    return task.on(
      'state_changed',
      (progress) => {
        fileToUpload.value.progress =
          (progress.bytesTransferred / progress.totalBytes) * 100
      },
      (error) => {
        fileToUpload.value.failed = true
        fileToUpload.value.error = error
        return false
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        board.image = {
          name: itemFilename,
          originalName: fileToUpload.value.file.name,
          downloadURL: url,
          uuid: fileToUpload.value.uuid,
        }
      }
    )
  }

  return {
    board,
    fileToUpload,
    boards,
    createBoard,
    deleteBoard,
    uploadFiles,
    addBoard,
  };
};
