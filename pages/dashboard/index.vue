<script lang="ts" setup>
import { v4 as uuidv4 } from "uuid";
import { Camera, EllipsisVertical } from 'lucide-vue-next'
definePageMeta({
    middleware: 'auth',
    layout: 'auth'
})
const { boards, addBoard, board, fileToUpload, uploadFiles, createBoard, deleteBoard } = await useBoards()

const isOpen = ref(false)
const boardBackground = ref(null as any)
const isLoaded = ref(false)
const popover = ref(false)
const tempBoard = ref('')

const toggleOpen = () => {
    isOpen.value = !isOpen.value
}

const addBoardFunc = () => {
    addBoard()
    createBoard()
    toggleOpen()
}
const chooseImage = () => {
    if (boardBackground.value)
        boardBackground.value.click()
}
const onFileClicked = ($event: any) => {
    $event!.target!.value = ''
}
const onFileSelected = (event: any) => {
    try {
        let file = event.target.files[0]
        fileToUpload.value = {
            file,
            originalName: file.name,
            loading: false,
            progress: 0,
            success: false,
            error: false,
            previewPath: '',
            uuid: uuidv4(),
        }
        uploadFiles()
    } catch (error) { }
}
const resetData = () => {
    fileToUpload.value = {}
    board.image = {
        name: "",
        originalName: "",
        downloadURL: "",
        uuid: "",
    }
    board.title = ''
    board.dateCreated = Date.now()
}

const goToBoard = (id: number) => {
    navigateTo(`/dashboard/${id}`)
}

const openPopover = (boardID: string) => {
    tempBoard.value = boardID
    popover.value = !popover.value
}

const deleteBoardFunc = (boardID: string) => {
    deleteBoard(boardID)
    tempBoard.value = ''
    popover.value = false
}

onMounted(() => {
    isLoaded.value = true
})
onUnmounted(() => {
    isLoaded.value = false
})
</script>

<template>
    <div class="base-background min-h-[92.5vh] p-5">
        <div class="flex backdrop-blur-md bg-white/30 p-10 rounded flex-wrap items-center">
            <p class="mr-5" v-if="boards.length === 0">You have no boards yet.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 items-center mx-auto" v-else>
                <Card @click="goToBoard(boardItem.id)" class="bg-cover bg-no-repeat bg-center cursor-pointer relative min-w-[120px]"
                    :style="`background-image: url('${boardItem.image.downloadURL ? boardItem.image.downloadURL : ''}')`"
                    v-for="boardItem in boards">
                    <CardHeader>
                        <CardTitle class="whitespace-nowrap text-ellipsis max-w-[115px] overflow-hidden">
                            {{ boardItem.title }}</CardTitle>
                        <CardDescription class="text-black">{{ timestampToDate(boardItem.dateCreated) }}</CardDescription>
                    </CardHeader>
                    <Popover v-model:open="popover">
                        <PopoverTrigger>
                            <div @click.stop="openPopover(boardItem.id)"
                                class="absolute cursor-pointer top-0 right-0 bg-white p-2 w-8 rounded-se rounded-es">
                                <div class="flex flex-col items-center">
                                    <span v-for="i in 3" class="h-0.5 w-0.5 rounded-full bg-black mb-0.5"></span>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent :align="'start'" class="w-fit" v-if="tempBoard === boardItem.id">
                            <Button @click="deleteBoardFunc(boardItem.id)" variant="destructive" type="button">
                                        Delete board
                                    </Button>
                        </PopoverContent>
                    </Popover>
                </Card>
                <Dialog v-model:open="isOpen" @update:open="resetData">
                <DialogTrigger as-child>
                    <Button class="ml-5" variant="outline">
                        Add board
                    </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add board form</DialogTitle>
                        <DialogDescription>
                            Fill necessary fields that marked as "<span class="text-red">*</span>"
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label necessary for="name" class="text-right">
                                Title
                            </Label>
                            <Input v-model="board.title" id="name" class="col-span-3" />
                        </div>
                        <div class="grid grid-cols-1 items-center gap-4">
                            <div class="flex flex-column align-center justify-center flex-grow-1 upload-block"
                                @click="chooseImage"
                                :style="`background-image: url('${board.image.downloadURL ? board.image.downloadURL : ''}');height:150px;background-size: cover;background-position: center;`">
                                <template v-if="!fileToUpload.progress || fileToUpload.progress == 0">
                                    <div class="flex flex-col items-center">
                                        <Button>
                                            <p>Add a board background</p>
                                        </Button>
                                        <Camera class="mt-10" :size="40" />
                                        <input type="file" accept="jpg, jpeg, png" ref="boardBackground" multiple
                                            color="#f66f26" buffer-value="0" @click="onFileClicked($event)"
                                            @change="onFileSelected($event)" style="display: none" />
                                    </div>
                                </template>
                                <template v-else-if="
                                    fileToUpload.progress > 0 && fileToUpload.progress < 100
                                ">
                                </template>
                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        <Button :disabled="!board.title || !board.image.downloadURL" @click="addBoardFunc"
                            type="submit">
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
            <Dialog v-if="boards.length === 0" v-model:open="isOpen" @update:open="resetData">
                <DialogTrigger as-child>
                    <Button variant="outline">
                        Add board
                    </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add board form</DialogTitle>
                        <DialogDescription>
                            Fill necessary fields that marked as "<span class="text-red">*</span>"
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label necessary for="name" class="text-right">
                                Title
                            </Label>
                            <Input v-model="board.title" id="name" class="col-span-3" />
                        </div>
                        <div class="grid grid-cols-1 items-center gap-4">
                            <div class="flex flex-column align-center justify-center flex-grow-1 upload-block"
                                @click="chooseImage"
                                :style="`background-image: url('${board.image.downloadURL ? board.image.downloadURL : ''}');height:150px;background-size: cover;background-position: center;`">
                                <template v-if="!fileToUpload.progress || fileToUpload.progress == 0">
                                    <div class="flex flex-col items-center">
                                        <Button>
                                            <p>Add a board background</p>
                                        </Button>
                                        <Camera class="mt-10" :size="40" />
                                        <input type="file" accept="jpg, jpeg, png" ref="boardBackground" multiple
                                            color="#f66f26" buffer-value="0" @click="onFileClicked($event)"
                                            @change="onFileSelected($event)" style="display: none" />
                                    </div>
                                </template>
                                <template v-else-if="
                                    fileToUpload.progress > 0 && fileToUpload.progress < 100
                                ">
                                </template>
                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        <Button :disabled="!board.title || !board.image.downloadURL" @click="addBoardFunc"
                            type="submit">
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
