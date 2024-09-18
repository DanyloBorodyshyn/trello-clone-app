import { defineStore } from "pinia";

export const useTableStore = defineStore('tableStore',{
    state: ()=>({
        boardTitle: 'Trello test app',
        mockedUsers:[
            {
                id:1,
                username: 'first_person',
                email: 'first_person@gmail.com'
            },
            {
                id:2,
                username: 'Test',
                email: 'test@gmail.com'
            },
            {
                id:3,
                username: 'Stylist',
                email: 'stylist@gmail.com'
            },
            {
                id:4,
                username: 'client',
                email: 'client@gmail.com'
            },
        ]
    }),
    actions: {},
})