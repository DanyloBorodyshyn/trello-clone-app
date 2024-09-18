<script lang="ts" setup>
import { Trash2, Check, ChevronsUpDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

definePageMeta({
    middleware: 'auth',
    layout: 'auth'
})
const route = useRoute()

const tableStore = useTableStore()

const users = computed(() => tableStore.mockedUsers.map(el => ({ value: el.id.toString(), label: el.username })))

const isOpen = ref(false)
const isOpenCard = ref(false)
const isOpenCardToEdit = ref(false)
const tempCardName = ref('')
const tempCardDescr = ref('')
const tempPriority = ref('false')
const openUserSelect = ref(false)
const openStatus = ref(false)
const openPerformersSelect = ref(false)
const userValue = ref({
    value: '',
    label: ''
})
const listValue = ref({
    value: '',
    label: ''
})
const performersValue = ref([] as any)
watch(userValue, () => {
    console.log(userValue.value);

})
const { createList, boardData: board, list, drop,
    allowDrop,
    deleteList,
    card,
    drag,
    updateCardList,
    currentCard,
    createCard,
    deleteCard,
    listId,
    updateCard,
    editCard } = await useList(route.params.id as string)

const parsedBoardsList = computed(()=>board.value.lists.map((el: { title: any; id: any; })=>({label: el.title,value: el.id})))


const toggleOpen = () => {
    isOpen.value = !isOpen.value
}

const toggleOpenCard = () => {
    isOpenCard.value = !isOpenCard.value
}

const toggleOpenCardToEdit = (card: any, listItem: any) => {
    console.log(card);
    userValue.value = card.mainUser
    performersValue.value = card.performers
    listValue.value = {
        value: listItem.id,
        label: listItem.title
    }
    tempCardName.value = card.title
    tempCardDescr.value = card.description
    tempPriority.value = card.priority
    currentCard.value = card
    isOpenCardToEdit.value = !isOpenCardToEdit.value
    editCard(card)
}

const createNewList = async () => {
    toggleOpen()
    await createList()
}

const createNewCard = async () => {
    toggleOpenCard()
    await createCard()
}

const editCardFunc = async () => {
    isOpenCardToEdit.value = false
    editCard({
        ...currentCard.value,
        title: tempCardName.value,
        priority: tempPriority.value,
        mainUser: userValue.value,
        performers: performersValue.value,
        description: tempCardDescr.value
    })
    await updateCardList(listValue.value.value,currentCard.value)
    await updateCard()
    tempCardName.value = ''
    tempPriority.value = 'false'
    tempCardDescr.value = ''
    userValue.value = {
        value: '',
        label: ''
    }
    performersValue.value = []
    listValue.value = {
        value: '',
        label: ''
    }
}

const deleteCardFunc = () => {
    deleteCard()
    isOpenCardToEdit.value = false
    tempCardName.value = ''
    tempPriority.value = 'false'
}


</script>

<template>
    <div :style="board.image.downloadURL
        ? `background:url(${board.image.downloadURL});background-size:cover; background-position: center;`
        : ''
        " class="min-h-[92.5vh] p-5">
        <h1 class="text-white text-5xl mb-5">{{ board.title }}</h1>
        <div class="flex backdrop-blur-md bg-white/30 md:p-10 xs:p-5 rounded items-start overflow-auto relative min-h-[50vh]">
            <div v-for="listItem in board.lists" @drop="drop($event, listItem.id)" @dragover="allowDrop($event)"
                class="flex flex-col mr-6 list min-w-[300px] bg-white rounded p-5 pt-0 max-h-[600px] overflow-auto relative"
                v-bind:key="listItem.id">
                <div class="flex justify-between items-center mb-5 sticky bg-white py-5 top-0 border-b">
                    <h4 class="text-4xl text-ellipsis overflow-hidden whitespace-nowrap">{{ listItem.title }}</h4>
                    <div class="cursor-pointer" @click="deleteList(listItem.id)">
                        <Trash2 />
                    </div>
                </div>
                <Card :class="{ 'border border-red': card.priority === 'true' }" class="mb-5 cursor-pointer"
                    :draggable="true" @dragover.prevent @dragstart="drag($event, card)"
                    v-for="(card, idx) in listItem.cards" @click="toggleOpenCardToEdit(card, listItem)">
                    <CardHeader>
                        <CardTitle class="text-ellipsis overflow-hidden whitespace-nowrap"> {{ card.title }}</CardTitle>
                        <CardDescription>
                            <p v-if="card.mainUser.label">Responsible person: {{ card.mainUser.label }}</p>
                            <p v-if="card.performers.length" class="mt-1 flex flex-wrap max-w-[200px]">Performers: <span v-for="performer in card.performers">{{ performer.label }},</span></p>
                        </CardDescription>
                    </CardHeader>
                    <Dialog v-model:open="isOpenCardToEdit">
                        <DialogContent v-if="currentCard.id === card.id" class="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Card info</DialogTitle>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                                <div class="grid items-center gap-4">
                                    <Input placeholder="Title" v-model="tempCardName" id="name" class="col-span-3" />
                                    <Label for="description">
                                        Description
                                    </Label>
                                    <Textarea placeholder="Description" v-model="tempCardDescr" id="description"
                                        class="col-span-3" />
                                    <div>
                                        <Label for="priority">
                                            Priority
                                        </Label>
                                        <RadioGroup v-model="tempPriority" class="w-full" name="priority"
                                            default-value="false">
                                            <div class="flex items-center space-x-2">
                                                <RadioGroupItem id="false" value="false" />
                                                <Label for="false">No</Label>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <RadioGroupItem id="true" value="true" />
                                                <Label for="true">Yes</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <Label for="priority">
                                            Responsible person
                                        </Label>
                                        <Popover v-model:open="openUserSelect">
                                            <PopoverTrigger as-child>
                                                <Button variant="outline" role="combobox"
                                                    :aria-expanded="openUserSelect" class="w-[200px] justify-between">
                                                    {{ userValue.value ? users.find((user) => user.value ===
                                                        userValue.value)?.label : 'Select user...' }}

                                                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent class="w-[200px] p-0">
                                                <Command v-model="userValue">
                                                    <CommandInput placeholder="Search user..." />
                                                    <CommandEmpty>No user found.</CommandEmpty>
                                                    <CommandList>
                                                        <CommandGroup>
                                                            <CommandItem v-for="user in users" :key="user.value"
                                                            @select="openUserSelect = false"
                                                                :value="user">
                                                                <Check :class="cn(
                                                                    'mr-2 h-4 w-4',
                                                                    userValue.value === user.value ? 'opacity-100' : 'opacity-0',
                                                                )" />
                                                                {{ user.label }}
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div>
                                    <Label class="mr-4" for="priority">
                                        Performers
                                    </Label>
                                    <Popover v-model:open="openPerformersSelect">
                                        <PopoverTrigger as-child>
                                            <Button variant="outline" role="combobox"
                                                :aria-expanded="openPerformersSelect" class="w-[200px] justify-between">
                                                <p v-if="performersValue.length"
                                                    class="whitespace-nowrap text-ellipsis overflow-hidden">
                                                    <span v-for="item in performersValue">{{ item.label }},</span>
                                                </p>
                                                <p v-else>Select Performers...</p>
                                                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent class="w-[200px] p-0">
                                            <Command :multiple="true" v-model="performersValue">
                                                <CommandInput placeholder="Search user..." />
                                                <CommandEmpty>No user found.</CommandEmpty>
                                                <CommandList>
                                                    <CommandGroup>
                                                        <CommandItem v-for="user in users" :key="user.value"
                                                            :value="user">
                                                            <Check :class="cn(
                                                                'mr-2 h-4 w-4',
                                                                performersValue.find((item: any) => item.value === user.value) ? 'opacity-100' : 'opacity-0',
                                                            )" />
                                                            {{ user.label }}
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label class="mr-4" for="priority">
                                        Status
                                    </Label>
                                    <Popover v-model:open="openStatus">
                                        <PopoverTrigger as-child>
                                            <Button variant="outline" role="combobox" :aria-expanded="openStatus"
                                                class="w-[200px] justify-between">
                                                {{ listValue.value ? parsedBoardsList.find((list: any) => list.value ===
                                                    listValue.value)?.label : 'Select list...' }}

                                                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent class="w-[200px] p-0">
                                            <Command v-model="listValue">
                                                <CommandInput placeholder="Search list..." />
                                                <CommandEmpty>No list found.</CommandEmpty>
                                                <CommandList>
                                                    <CommandGroup>
                                                        <CommandItem v-for="list in parsedBoardsList" :key="list.value"
                                                        @select="openStatus = false"
                                                            :value="list">
                                                            <Check :class="cn(
                                                                'mr-2 h-4 w-4',
                                                                listValue.value === list.value ? 'opacity-100' : 'opacity-0',
                                                            )" />
                                                            {{ list.label }}
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <DialogFooter>
                                <div class="flex items-center space-x-5">
                                    <Button @click="deleteCardFunc" variant="destructive" type="button">
                                        Delete
                                    </Button>
                                    <Button :disabled="!tempCardName" @click="editCardFunc" type="submit">
                                        Save
                                    </Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Card>
                <Dialog v-model:open="isOpenCard">
                    <DialogTrigger as-child>
                        <Button @click="listId = listItem.id" variant="outline">
                            Create card
                        </Button>
                    </DialogTrigger>
                    <DialogContent v-if="listId === listItem.id" class="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create card</DialogTitle>
                            <DialogDescription>
                                Fill necessary fields that marked as "<span class="text-red">*</span>"
                            </DialogDescription>
                        </DialogHeader>
                        <div class="grid gap-4 py-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label necessary for="name" class="text-right">
                                    Card title
                                </Label>
                                <Input v-model="card.title" id="name" class="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button :disabled="!card.title" @click="() => {
                                createNewCard()
                            }" type="submit">
                                Create new card
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog v-model:open="isOpen" f>
                <DialogTrigger as-child>
                    <Button variant="outline">
                        Create list
                    </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create list</DialogTitle>
                        <DialogDescription>
                            Fill necessary fields that marked as "<span class="text-red">*</span>"
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                        <div class="grid grid-cols-4 items-center gap-4">
                            <Label necessary for="name" class="text-right">
                                List title
                            </Label>
                            <Input v-model="list.title" id="name" class="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button :disabled="!list.title" @click="createNewList" type="submit">
                            Create new list
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
